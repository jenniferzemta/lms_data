export interface ChunkedUploadInitResponse {
  upload_id: string;
  filename: string;
  total_chunks: number;
  chunk_size: number;
  status: string;
}

export interface ChunkedUploadStatus {
  id: string;
  filename: string;
  file_size: number;
  chunk_size: number;
  total_chunks: number;
  uploaded_chunks: number[];
  progress_percentage: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  is_completed: boolean;
  checksum?: string;
  file_url?: string;
  created_at?: string;
  completed_at?: string;
}

export interface UploadProgressInfo {
  progressPercentage: number;
  uploadedChunks: number;
  totalChunks: number;
  speedKoS: number;
  remainingSeconds: number;
  isPaused: boolean;
  isCompleted: boolean;
  error?: string;
  fileUrl?: string;
}
