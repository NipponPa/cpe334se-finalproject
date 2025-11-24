'use client';

import React, { useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { uploadProfilePicture } from '@/lib/profilePictureUtils';
import { optimizeImage, validateImageFile } from '@/lib/imageOptimizer';
import { Pencil } from 'lucide-react';

interface ProfilePictureUploadProps {
  onPictureChange?: (newPictureUrl: string | null) => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ onPictureChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // ตรวจสอบไฟล์ภาพ
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error);
      // เคลียร์ค่า input เพื่อให้เลือกไฟล์เดิมได้อีกครั้ง
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true);

    try {
      // ย่อ/บีบอัดรูปก่อนอัปโหลด
      const optimizedBlob = await optimizeImage(file, 800, 800, 0.8);
      const optimizedFile = new File([optimizedBlob], file.name, { type: file.type });

      // อัปโหลดไป Supabase storage (ใช้ util เดิม)
      const result = await uploadProfilePicture(optimizedFile);

      // แจ้ง parent ให้เปลี่ยนรูปโปรไฟล์
      if (onPictureChange) {
        onPictureChange(result.url);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while uploading';
      setError(errorMessage);
    } finally {
      setIsUploading(false);
      // เคลียร์ค่า input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      {/* ปุ่มไอคอนดินสอเล็ก ๆ */}
      <button
        type="button"
        onClick={handleClick}
        disabled={isUploading || !user}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FFD966] text-black shadow-md hover:bg-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFD966]"
        title={isUploading ? 'Uploading...' : 'Change profile picture'}
      >
        <Pencil size={16} />
      </button>

      {/* input file ซ่อนอยู่ */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
      />

      {/* แสดง error เล็ก ๆ ใต้ไอคอน (ถ้ามี) */}
      {error && (
        <p className="mt-1 text-xs text-red-300 max-w-[160px]">
          {error}
        </p>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
