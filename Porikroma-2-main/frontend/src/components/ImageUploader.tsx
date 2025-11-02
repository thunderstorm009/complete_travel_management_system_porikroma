import React, { useState } from "react";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { uploadImage, resizeImage } from "../utils/imageUpload";
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";

interface ImageUploaderProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
  className?: string;
  placeholder?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  currentImage,
  className = "",
  placeholder = "Upload Image",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Resize image if needed
      const resizedFile = await resizeImage(file, 1200, 800);

      // Upload to ImgBB
      const uploadedUrl = await uploadImage(resizedFile);
      onImageUpload(uploadedUrl);

      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
      setPreview(currentImage || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageUpload("");
  };

  return (
    <div className={`relative ${className}`}>
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
            disabled={isUploading}
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <LoadingSpinner size="lg" />
            </div>
          )}
        </div>
      ) : (
        <label className="cursor-pointer">
          <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-primary-400 transition-colors">
            {isUploading ? (
              <LoadingSpinner size="lg" />
            ) : (
              <>
                <PhotoIcon className="h-12 w-12 text-gray-400 mb-2" />
                <span className="text-gray-600 text-sm">{placeholder}</span>
                <span className="text-gray-400 text-xs mt-1">
                  PNG, JPG up to 5MB
                </span>
              </>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
};

export default ImageUploader;
