import os
import shutil
from io import BytesIO
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from rest_framework import status
from rest_framework.test import APIClient

from courses.models import ChunkedUpload, LearningEvent

User = get_user_model()


class ChunkedUploadTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='mballa.analyst@datamboa.cm',
            password='securepassword123',
            first_name='Mballa',
            last_name='Analyst',
        )
        self.other_user = User.objects.create_user(
            email='other.student@datamboa.cm',
            password='securepassword123',
            first_name='Other',
            last_name='Student',
        )
        self.client.force_authenticate(user=self.user)

    def tearDown(self):
        # Clean up any leftover media/chunks directories
        chunks_dir = os.path.join(settings.MEDIA_ROOT, 'chunks')
        uploads_dir = os.path.join(settings.MEDIA_ROOT, 'chunked_uploads')
        if os.path.exists(chunks_dir):
            shutil.rmtree(chunks_dir, ignore_errors=True)
        if os.path.exists(uploads_dir):
            shutil.rmtree(uploads_dir, ignore_errors=True)

    def test_init_chunked_upload_unauthenticated(self):
        anon_client = APIClient()
        response = anon_client.post('/api/v1/courses/uploads/init/', {
            'filename': 'ventes_douala_2026.xlsx',
            'file_size': 3000,
            'total_chunks': 3,
            'chunk_size': 1000,
        })
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_init_chunked_upload_success(self):
        response = self.client.post('/api/v1/courses/uploads/init/', {
            'filename': 'audit_microfinance_bafoussam.pbix',
            'file_size': 3000,
            'total_chunks': 3,
            'chunk_size': 1000,
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('upload_id', response.data)
        self.assertEqual(response.data['total_chunks'], 3)
        self.assertEqual(response.data['status'], 'IN_PROGRESS')

    def test_upload_chunk_sequence_and_finalization(self):
        # 1. Init
        init_res = self.client.post('/api/v1/courses/uploads/init/', {
            'filename': 'rapport_financier.xlsx',
            'file_size': 30,
            'total_chunks': 3,
            'chunk_size': 10,
        })
        upload_id = init_res.data['upload_id']

        # 2. Upload Chunk 0 (10 bytes: '0123456789')
        f0 = SimpleUploadedFile('chunk0.bin', b'0123456789', content_type='application/octet-stream')
        res0 = self.client.post(
            f'/api/v1/courses/uploads/{upload_id}/chunk/',
            {'chunk_index': 0, 'chunk': f0},
            format='multipart'
        )
        self.assertEqual(res0.status_code, status.HTTP_200_OK)
        self.assertEqual(res0.data['uploaded_chunks'], [0])
        self.assertEqual(res0.data['progress_percentage'], 33)
        self.assertFalse(res0.data['is_completed'])

        # 3. Check status endpoint mid-upload
        status_res = self.client.get(f'/api/v1/courses/uploads/{upload_id}/status/')
        self.assertEqual(status_res.status_code, status.HTTP_200_OK)
        self.assertEqual(status_res.data['uploaded_chunks'], [0])
        self.assertEqual(status_res.data['progress_percentage'], 33)

        # 4. Upload Chunk 1 (10 bytes: 'ABCDEFGHIJ')
        f1 = SimpleUploadedFile('chunk1.bin', b'ABCDEFGHIJ', content_type='application/octet-stream')
        res1 = self.client.post(
            f'/api/v1/courses/uploads/{upload_id}/chunk/',
            {'chunk_index': 1, 'chunk': f1},
            format='multipart'
        )
        self.assertEqual(res1.status_code, status.HTTP_200_OK)
        self.assertEqual(res1.data['uploaded_chunks'], [0, 1])
        self.assertEqual(res1.data['progress_percentage'], 66)
        self.assertFalse(res1.data['is_completed'])

        # 5. Upload Chunk 2 (Final chunk: 10 bytes: 'KLMNOPQRST')
        f2 = SimpleUploadedFile('chunk2.bin', b'KLMNOPQRST', content_type='application/octet-stream')
        res2 = self.client.post(
            f'/api/v1/courses/uploads/{upload_id}/chunk/',
            {'chunk_index': 2, 'chunk': f2},
            format='multipart'
        )
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertEqual(res2.data['uploaded_chunks'], [0, 1, 2])
        self.assertEqual(res2.data['progress_percentage'], 100)
        self.assertTrue(res2.data['is_completed'])
        self.assertEqual(res2.data['status'], 'COMPLETED')
        self.assertTrue(len(res2.data['checksum']) > 0)

        # 6. Verify assembled file on disk
        upload = ChunkedUpload.objects.get(id=upload_id)
        self.assertEqual(upload.status, ChunkedUpload.Status.COMPLETED)
        assembled_full_path = os.path.join(settings.MEDIA_ROOT, upload.file.name)
        self.assertTrue(os.path.exists(assembled_full_path))
        with open(assembled_full_path, 'rb') as f:
            content = f.read()
        self.assertEqual(content, b'0123456789ABCDEFGHIJKLMNOPQRST')

        # 7. Verify xAPI event emission (R15)
        events = LearningEvent.objects.filter(user=self.user, verb='uploaded')
        self.assertTrue(events.exists())
        self.assertEqual(events.first().object_name, 'rapport_financier.xlsx')

    def test_upload_out_of_order_chunks(self):
        init_res = self.client.post('/api/v1/courses/uploads/init/', {
            'filename': 'out_of_order.csv',
            'file_size': 20,
            'total_chunks': 2,
            'chunk_size': 10,
        })
        upload_id = init_res.data['upload_id']

        # Send chunk 1 first
        f1 = SimpleUploadedFile('c1.bin', b'SECOND_PART', content_type='application/octet-stream')
        self.client.post(f'/api/v1/courses/uploads/{upload_id}/chunk/', {'chunk_index': 1, 'chunk': f1}, format='multipart')

        # Send chunk 0 second
        f0 = SimpleUploadedFile('c0.bin', b'FIRST_PART_', content_type='application/octet-stream')
        res = self.client.post(f'/api/v1/courses/uploads/{upload_id}/chunk/', {'chunk_index': 0, 'chunk': f0}, format='multipart')

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data['is_completed'])

        upload = ChunkedUpload.objects.get(id=upload_id)
        assembled_path = os.path.join(settings.MEDIA_ROOT, upload.file.name)
        with open(assembled_path, 'rb') as f:
            content = f.read()
        self.assertEqual(content, b'FIRST_PART_SECOND_PART')

    def test_upload_access_isolation(self):
        init_res = self.client.post('/api/v1/courses/uploads/init/', {
            'filename': 'secret_dataset.xlsx',
            'file_size': 100,
            'total_chunks': 1,
            'chunk_size': 100,
        })
        upload_id = init_res.data['upload_id']

        # Switch to other user
        other_client = APIClient()
        other_client.force_authenticate(user=self.other_user)

        status_res = other_client.get(f'/api/v1/courses/uploads/{upload_id}/status/')
        self.assertEqual(status_res.status_code, status.HTTP_404_NOT_FOUND)

        f = SimpleUploadedFile('c0.bin', b'0' * 100, content_type='application/octet-stream')
        chunk_res = other_client.post(
            f'/api/v1/courses/uploads/{upload_id}/chunk/',
            {'chunk_index': 0, 'chunk': f},
            format='multipart'
        )
        self.assertEqual(chunk_res.status_code, status.HTTP_404_NOT_FOUND)
