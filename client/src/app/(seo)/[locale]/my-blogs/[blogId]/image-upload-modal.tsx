'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import FileUploader from '@/components/ui.custom/file-uploader';
import { X } from 'lucide-react';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (imageUrl: string) => void;
}

export function ImageUploadModal({ isOpen, onClose, onUploadSuccess }: ImageUploadModalProps) {

  const handleFileUpload = (files: { url: string; width?: number; height?: number; _id?: string }[]) => {
    if (files.length > 0) {
      // Get the first image URL (since we're only allowing one)
      const imageUrl = files[0].url;
      
      // Pass the URL back to the TipTap editor
      onUploadSuccess(imageUrl);
      
      // Close the modal
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-4">
          <FileUploader
            multiple={false}
            accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] }}
            maxFiles={1}
            maxSize={5 * 1024 * 1024} // 5MB limit
            onFileUpload={handleFileUpload}
            options={{ refType: 'blog-content' }}
          />
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          Supported formats: PNG, JPG, GIF, WEBP. Maximum file size: 5MB.
        </div>
      </DialogContent>
    </Dialog>
  );
}