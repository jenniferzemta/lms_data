import { ChunkedUploadInitResponse, ChunkedUploadStatus, UploadProgressInfo } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const DEFAULT_CHUNK_SIZE = 512 * 1024; // 512 KB per chunk for high reliability on 3G

export class ResumableChunkedUploader {
  private file: File;
  private chunkSize: number;
  private uploadId: string | null = null;
  private isPaused: boolean = false;
  private isCancelled: boolean = false;
  private onProgressCallback?: (info: UploadProgressInfo) => void;

  constructor(file: File, chunkSize: number = DEFAULT_CHUNK_SIZE) {
    this.file = file;
    this.chunkSize = chunkSize;
  }

  public setOnProgress(callback: (info: UploadProgressInfo) => void) {
    this.onProgressCallback = callback;
  }

  public pause() {
    this.isPaused = true;
  }

  public resume() {
    if (this.isPaused) {
      this.isPaused = false;
      this.start();
    }
  }

  public cancel() {
    this.isCancelled = true;
    this.isPaused = true;
  }

  public async start(): Promise<ChunkedUploadStatus> {
    const totalChunks = Math.ceil(this.file.size / this.chunkSize) || 1;
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const authHeaders: Record<string, string> = {};
    if (token) {
      authHeaders['Authorization'] = `Bearer ${token}`;
    }

    // Step 1: Initialize or resume upload
    if (!this.uploadId) {
      const initRes = await fetch(`${API_BASE_URL}/api/v1/courses/uploads/init/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({
          filename: this.file.name,
          file_size: this.file.size,
          total_chunks: totalChunks,
          chunk_size: this.chunkSize,
        }),
      });

      if (!initRes.ok) {
        throw new Error(`Échec d'initialisation de l'envoi (${initRes.status})`);
      }

      const initData: ChunkedUploadInitResponse = await initRes.json();
      this.uploadId = initData.upload_id;
    }

    // Step 2: Query already uploaded chunks (for resumption after network drop)
    const statusRes = await fetch(`${API_BASE_URL}/api/v1/courses/uploads/${this.uploadId}/status/`, {
      method: 'GET',
      headers: authHeaders,
    });

    let uploadedIndices: number[] = [];
    if (statusRes.ok) {
      const statusData: ChunkedUploadStatus = await statusRes.json();
      if (statusData.is_completed) {
        this.notifyProgress(100, totalChunks, totalChunks, 0, 0, false, true, undefined, statusData.file_url);
        return statusData;
      }
      uploadedIndices = statusData.uploaded_chunks || [];
    }

    // Step 3: Upload missing chunks
    const startTime = Date.now();
    let bytesSentInSession = 0;
    let lastStatus: ChunkedUploadStatus | null = null;

    for (let index = 0; index < totalChunks; index++) {
      if (this.isCancelled) {
        throw new Error("Téléversement annulé.");
      }

      if (this.isPaused) {
        this.notifyProgress(
          Math.round((uploadedIndices.length / totalChunks) * 100),
          uploadedIndices.length,
          totalChunks,
          0,
          0,
          true,
          false
        );
        return (lastStatus || {
          id: this.uploadId!,
          filename: this.file.name,
          file_size: this.file.size,
          chunk_size: this.chunkSize,
          total_chunks: totalChunks,
          uploaded_chunks: uploadedIndices,
          progress_percentage: Math.round((uploadedIndices.length / totalChunks) * 100),
          status: 'IN_PROGRESS',
          is_completed: false,
        }) as ChunkedUploadStatus;
      }

      // Skip already uploaded chunk
      if (uploadedIndices.includes(index)) {
        continue;
      }

      const start = index * this.chunkSize;
      const end = Math.min(start + this.chunkSize, this.file.size);
      const chunkBlob = this.file.slice(start, end);

      // Upload with retry loop (resilient against African 3G interruptions)
      let attempts = 0;
      let success = false;
      while (attempts < 3 && !success) {
        try {
          const formData = new FormData();
          formData.append('chunk_index', index.toString());
          formData.append('chunk', chunkBlob, `chunk_${index}`);

          const chunkRes = await fetch(`${API_BASE_URL}/api/v1/courses/uploads/${this.uploadId}/chunk/`, {
            method: 'POST',
            headers: authHeaders,
            body: formData,
          });

          if (!chunkRes.ok) {
            throw new Error(`Erreur lors de l'envoi du bloc ${index} (${chunkRes.status})`);
          }

          lastStatus = await chunkRes.json();
          uploadedIndices.push(index);
          bytesSentInSession += (end - start);
          success = true;

          // Speed and ETA metrics
          const elapsedSec = (Date.now() - startTime) / 1000;
          const speedKoS = elapsedSec > 0 ? Math.round((bytesSentInSession / 1024) / elapsedSec) : 0;
          const remainingChunks = totalChunks - uploadedIndices.length;
          const remainingBytes = remainingChunks * this.chunkSize;
          const remainingSeconds = speedKoS > 0 ? Math.round((remainingBytes / 1024) / speedKoS) : 0;
          const pct = Math.round((uploadedIndices.length / totalChunks) * 100);

          this.notifyProgress(
            pct,
            uploadedIndices.length,
            totalChunks,
            speedKoS,
            remainingSeconds,
            false,
            lastStatus?.is_completed || false,
            undefined,
            lastStatus?.file_url
          );
        } catch (err) {
          attempts++;
          if (attempts >= 3) {
            this.notifyProgress(
              Math.round((uploadedIndices.length / totalChunks) * 100),
              uploadedIndices.length,
              totalChunks,
              0,
              0,
              false,
              false,
              (err as Error).message
            );
            throw err;
          }
          // Exponential backoff wait (1s, 2s)
          await new Promise(res => setTimeout(res, attempts * 1000));
        }
      }
    }

    if (!lastStatus) {
      throw new Error("Erreur inattendue : aucun statut retourné.");
    }

    return lastStatus;
  }

  private notifyProgress(
    progressPercentage: number,
    uploadedChunks: number,
    totalChunks: number,
    speedKoS: number,
    remainingSeconds: number,
    isPaused: boolean,
    isCompleted: boolean,
    error?: string,
    fileUrl?: string
  ) {
    if (this.onProgressCallback) {
      this.onProgressCallback({
        progressPercentage,
        uploadedChunks,
        totalChunks,
        speedKoS,
        remainingSeconds,
        isPaused,
        isCompleted,
        error,
        fileUrl,
      });
    }
  }
}
