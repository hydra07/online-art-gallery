// components/avatar-uploader.tsx
"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Image } from "lucide-react";
interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  folder?: string;
}

export function ImageUploader({ onUploadSuccess, folder }: ImageUploaderProps) {
  return (
    <div className="z-50">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_UPLOAD_PRESET}
        signatureEndpoint="/api/sign-cloudinary-params"
        onSuccess={async (result) => {
          if (typeof result.info === "object" && "secure_url" in result.info) {
            await onUploadSuccess(result.info.secure_url);
          }
        }}
        options={{
          singleUploadAutoClose: true,
          folder,
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="flex items-center justify-center rounded-full"
          >
            <Image className="" />
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
}
