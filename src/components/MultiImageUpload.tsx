"use client";

import React, { useState } from "react";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function MultiImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const uploadImage = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("Please select an image file");
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error("Image size must be less than 10MB");
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (images.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = files.map(async (file, index) => {
        setUploadingIndex(images.length + index);
        try {
          const url = await uploadImage(file);
          return url;
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
          throw new Error(
            `Failed to upload ${file.name}: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onImagesChange([...images, ...uploadedUrls]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to upload one or more images";
      alert(errorMessage);
    } finally {
      setUploading(false);
      setUploadingIndex(null);
      // Reset the input value to allow re-uploading the same file
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label
          htmlFor="image-upload"
          className="block text-sm font-medium text-gray-200"
        >
          Profile Images ({images.length}/{maxImages})
        </label>
        <input
          id="image-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading || images.length >= maxImages}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => document.getElementById("image-upload")?.click()}
          disabled={uploading || images.length >= maxImages}
          className="px-4 py-2 text-sm btn-purple text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          {uploading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Uploading...
            </span>
          ) : (
            "Add Images"
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((url, index) => (
          <div key={index} className="relative group card-hover">
            <img
              src={url}
              alt={`Profile ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border border-purple-500/30"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center text-sm hover:bg-red-600 hover:scale-110"
            >
              ×
            </button>
            {uploadingIndex === index && (
              <div className="absolute inset-0 glass flex items-center justify-center rounded-lg">
                <div className="flex items-center gap-2 text-white text-sm">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Uploading...
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: maxImages - images.length }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="w-full h-32 border-2 border-dashed border-purple-500/30 rounded-lg flex items-center justify-center text-purple-300 cursor-pointer hover:border-purple-400 hover:bg-purple-600/10 transition-all duration-300 card-hover"
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            <div className="text-center">
              <div className="text-2xl">+</div>
              <div className="text-xs">Add Image</div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-purple-300">
        Tip: Upload multiple images to create a more attractive profile. Maximum{" "}
        {maxImages} images.
      </p>
    </div>
  );
}
