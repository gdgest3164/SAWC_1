import { put, del } from '@vercel/blob';

export async function uploadImage(file: File, filename: string): Promise<string> {
  try {
    const blob = await put(`kiosk-images/${filename}`, file, {
      access: 'public',
    });
    return blob.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}

export async function deleteImage(url: string): Promise<void> {
  try {
    await del(url);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
}

export function generateImageFilename(originalName: string, roomId: string): string {
  const extension = originalName.split('.').pop();
  const timestamp = Date.now();
  return `room-${roomId}-${timestamp}.${extension}`;
}

export function validateImageFile(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error('지원되지 않는 파일 형식입니다. JPG, PNG, WebP 파일만 업로드 가능합니다.');
  }

  if (file.size > maxSize) {
    throw new Error('파일 크기가 너무 큽니다. 5MB 이하의 파일만 업로드 가능합니다.');
  }

  return true;
}