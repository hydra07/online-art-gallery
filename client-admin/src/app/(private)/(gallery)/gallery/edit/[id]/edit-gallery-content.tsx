'use client';

import { useState, useCallback, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GalleryTemplateCreator from '../../gallery-template-creator';
import { Loader } from '@/components/gallery-loader';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { type GalleryTemplateData } from '../../gallery-template-creator';
import { saveGalleryTemplateAction } from '../../actions';
import { useServerAction } from 'zsa-react';
import { z } from 'zod';
import PreviewMode from '../../preview-mode';

// Define the gallery template validation schema
const galleryTemplateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  dimensions: z.object({
    xAxis: z.number().min(5, "Width must be at least 5 units"),
    yAxis: z.number().min(5, "Height must be at least 5 units"),
    zAxis: z.number().min(5, "Depth must be at least 5 units")
  }),
  wallThickness: z.number().min(0.1, "Wall thickness must be at least 0.1 units"),
  wallHeight: z.number().min(1, "Wall height must be at least 1 unit"),
  modelPath: z.string().min(1, "Model path is required"),
  modelScale: z.number().min(0.1, "Model scale must be greater than 0"),
  modelRotation: z.tuple([z.number(), z.number(), z.number()]).optional(),
  modelPosition: z.tuple([z.number(), z.number(), z.number()]).optional(),
  previewImage: z.string().min(1, "Preview image is required"),
  // planImage: z.string().min(1, "Plane image is required"),
  isPremium: z.boolean().default(false),
  customColliders: z.array(z.any()).optional(),
  artworkPlacements: z.array(
    z.object({
      position: z.tuple([z.number(), z.number(), z.number()]),
      rotation: z.tuple([z.number(), z.number(), z.number()])
    })
  ).default([])
});


export default function EditGalleryContent({
  initialTemplate,
  locale,
  templateId
}: {
  initialTemplate: GalleryTemplateData;
  locale: string;
  templateId: string;
}) {
  const router = useRouter();
  const [activeView, setActiveView] = useState<'edit' | 'preview'>('edit');
  const [editedTemplate, setEditedTemplate] = useState<GalleryTemplateData>(initialTemplate);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { execute, isPending } = useServerAction(saveGalleryTemplateAction, {
    onError: (err) => {
      toast({
        title: 'Error',
        description: err.err.message,
        variant: 'destructive'
      });
    },
    onSuccess: () => {
      router.refresh();
      toast({
        title: 'Gallery template updated',
        description: 'Your gallery template has been updated successfully.',
        variant: 'success'
      });
    }
  });

  // Function to validate template using Zod
  const validateTemplate = useCallback((templateData: GalleryTemplateData) => {
    try {
      galleryTemplateSchema.parse(templateData);
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};

        // Convert Zod errors to a readable format
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });

        setValidationErrors(errors);

        // Show toast with the first error message
        const firstError = error.errors[0];
        toast({
          title: 'Validation Error',
          description: firstError.message,
          variant: 'destructive'
        });
      }
      return false;
    }
  }, []);

  // Handler for saving the template
  const handleSaveTemplate = async (templateData: GalleryTemplateData) => {
    // Ensure we keep the original ID
    const finalTemplateData = {
      ...templateData,
      id: templateId
    };

    setEditedTemplate(finalTemplateData);

    // Validate template data before saving
    if (!validateTemplate(finalTemplateData)) {
      console.log('Validation failed:', validationErrors);
      setActiveView('edit');
      return;
    }

    console.log('Updating gallery template:', finalTemplateData);
    await execute(finalTemplateData);
  };

  // Handler for template updates (for live preview without saving)
  const handleTemplateUpdate = (templateData: GalleryTemplateData) => {
    setEditedTemplate(templateData);
  };

  // Safe handler for view changes that ensures pointer lock is released
  const handleViewChange = (value: string) => {
    if (value === activeView) return;

    // Set transitioning state to disable active features in components
    setIsTransitioning(true);

    // Make sure pointer lock is released
    if (document.pointerLockElement) {
      try {
        document.exitPointerLock();
      } catch (error) {
        console.error("Failed to exit pointer lock:", error);
      }
    }

    // Delay the view change slightly to allow pointer lock to be released
    setTimeout(() => {
      setActiveView(value as 'edit' | 'preview');

      // Reset transitioning state after a short delay to allow components to adjust
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 50);
  };
  
  // Effect to handle cleanup of pointer lock when component unmounts
  useEffect(() => {
    return () => {
      if (document.pointerLockElement) {
        try {
          document.exitPointerLock();
        } catch (error) {
          console.error("Failed to exit pointer lock on unmount:", error);
        }
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Header bar with navigation and actions */}
      <div className="border-b bg-white sticky top-0 z-10">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Edit Gallery Template</h1>
          </div>

          <div>
            <Button
              variant="outline"
              onClick={() => router.push(`/${locale}/exhibitions/templates`)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Main content with Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs
          value={activeView}
          onValueChange={handleViewChange}
          className="h-full flex flex-col"
        >
          <div className="container mt-4">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="edit">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            <Suspense fallback={<div className="h-full flex items-center justify-center overflow-hidden"><Loader /></div>}>
              <TabsContent value="edit" className="mt-0 h-full">
                <div className="h-full py-6">
                  <GalleryTemplateCreator
                    onSave={handleSaveTemplate}
                    onUpdate={handleTemplateUpdate}
                    initialData={initialTemplate}
                    isSaving={isPending}
                    validationErrors={validationErrors}
                  />
                </div>
              </TabsContent>

              <TabsContent value="preview" className="mt-0 h-full">
                <div className="h-full bg-gray-900">
                  {editedTemplate ? (
                    <PreviewMode
                      templateData={editedTemplate}
                      isActive={activeView === 'preview' && !isTransitioning}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white">
                      <div className="text-center">
                        <p className="text-lg">No template data available for preview</p>
                        <p className="text-sm text-gray-400 mt-2">Create your gallery in the editor first</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Suspense>
          </div>
        </Tabs>
      </div>
    </div>
  );
}