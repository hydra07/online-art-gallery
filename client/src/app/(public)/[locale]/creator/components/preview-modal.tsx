'use client';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import PreviewMode from '@/app/(exhibitions)/[locale]/exhibitions/components/preview-mode';
import type { Gallery } from '@/types/new-gallery';

interface PreviewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  template: Gallery;
}

export default function PreviewModal({ isOpen, onOpenChange, template }: PreviewModalProps) {

  // Handle modal close with a slight delay for cleanup
  const handleClose = () => {
    // 1. Attempt to release pointer lock immediately
    //    (PreviewMode's internal cleanup should also handle this, but redundancy helps)
    if (document.pointerLockElement) {
      try {
        document.exitPointerLock();
      } catch (error) {
        console.warn("Attempted to exit pointer lock on modal close but failed (might be expected if already released):", error);
      }
    }

    // 2. Use setTimeout to delay the state change that unmounts the component
    //    This gives the browser a moment to process the exitPointerLock
    //    before the canvas element is removed from the DOM.
    //    A delay of 0ms often works, pushing execution to the next event loop tick.
    //    A slightly longer delay (e.g., 50ms) can be more robust if 0ms isn't enough.
    const closeDelay = 50; // milliseconds - adjust if needed (0, 50, 100)
    setTimeout(() => {
      onOpenChange(false); // This will trigger the unmount of DialogContent and PreviewMode
    }, closeDelay);
  };

  return (
    // Ensure Dialog unmounts content when closed (modal={true} helps)
    <Dialog open={isOpen} onOpenChange={(open) => {
        // Handle closing triggered by clicking outside or ESC key
        // We still want the delayed close logic
        if (!open) {
            handleClose();
        } else {
            // If it's opening, just call onOpenChange directly
            onOpenChange(true);
        }
    }} modal={true}>
        <DialogContent className="max-w-7xl w-[95vw] h-[90vh] p-0 pl-12 pt-4 bg-black focus:outline-none focus-visible:outline-none">
          {/* Explicit Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-4 z-50 bg-white/80 hover:bg-white"
            onClick={handleClose} // Ensure this calls our delayed handler
            aria-label="Close preview"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="w-full h-full p-0 m-0">
            {/* PreviewMode still relies on `isActive` which is driven by `isOpen` */}
            {/* Its internal cleanup useEffects (reacting to !isActive and unmount) are still crucial */}
            <PreviewMode
              templateData={template}
              isActive={isOpen}
            />
          </div>
        </DialogContent>
    </Dialog>
  );
}