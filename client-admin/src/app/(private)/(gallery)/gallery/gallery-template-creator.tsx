'use client';
import React, { useState, createContext, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import FileUploader from '@/components/ui.custom/file-uploader';
import { Card, CardContent } from '@/components/ui/card';
import GalleryPreview from './gallery-preview';
import ColliderEditor from './collider-editor';
// import Image from 'next/image';
import ArtworkPositionEditor from './artwork-position-editor';
import Image from 'next/image';
import { CustomCollider } from '@/types/gallery';
import { FloorPlanRenderer } from '@/components/gallery/floor-plan-renderer';

// Types
export interface GalleryTemplateData {
  id?: string;
  name: string;
  description: string;
  dimensions: {
    xAxis: number;
    yAxis: number;
    zAxis: number;
  };
  wallThickness: number;
  wallHeight: number;
  modelPath: string;
  modelScale: number;
  modelRotation: [number, number, number];
  modelPosition: [number, number, number];
  previewImage: string;
  // planImage: string;
  isPremium: boolean;
  isActive: boolean;
  customColliders: CustomCollider[];
  // Add artwork positions configuration
  artworkPlacements: {
    position: [number, number, number];
    rotation: [number, number, number];
  }[];
}

// Add this to your props interface at the top
interface GalleryTemplateCreatorProps {
  onSave?: (templateData: GalleryTemplateData) => Promise<void>;
  onUpdate?: (templateData: GalleryTemplateData) => void;
  initialData?: Partial<GalleryTemplateData>;
  isSaving?: boolean;
  validationErrors?: Record<string, string>;
}

// Context
interface GalleryTemplateContextType {
  templateData: GalleryTemplateData;
  updateTemplate: (data: Partial<GalleryTemplateData>) => void;
  addCollider: (collider: CustomCollider) => void;
  updateCollider: (index: number, collider: Partial<CustomCollider>) => void;
  removeCollider: (index: number) => void;
  isLoading: boolean;
}

const defaultTemplate: GalleryTemplateData = {
  name: 'New Gallery Template',
  description: 'A customizable gallery space',
  dimensions: {
    xAxis: 30,
    yAxis: 10,
    zAxis: 40
  },
  wallThickness: 0.2,
  wallHeight: 3,
  modelPath: '',
  modelScale: 3,
  modelRotation: [0, 0, 0],
  modelPosition: [0, 0, 0],
  previewImage: '',
  // planImage: '',
  isPremium: false,
  isActive: true,
  customColliders: [],
  // Default artwork positions
  artworkPlacements: []
};

export const GalleryTemplateContext = createContext<GalleryTemplateContextType>({
  templateData: defaultTemplate,
  updateTemplate: () => { },
  addCollider: () => { },
  updateCollider: () => { },
  removeCollider: () => { },
  isLoading: false
});

// Update the component signature to accept props
export default function GalleryTemplateCreator({
  onSave,
  onUpdate,
  initialData = {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isSaving = false,
  validationErrors
}: GalleryTemplateCreatorProps) {
  // Merge initial data with defaults
  const [templateData, setTemplateData] = useState<GalleryTemplateData>({
    ...defaultTemplate,
    ...initialData
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [showColliders, setShowColliders] = useState(true);

  // Template update function
  const updateTemplate = (data: Partial<GalleryTemplateData>) => {
    setTemplateData(prev => ({ ...prev, ...data }));
  };

  // Add this effect to call onUpdate when template changes
  useEffect(() => {
    if (onUpdate) {
      onUpdate(templateData);
    }
  }, [templateData, onUpdate]);

  // Collider management functions
  const addCollider = (collider: CustomCollider) => {
    setTemplateData(prev => ({
      ...prev,
      customColliders: [...prev.customColliders, collider]
    }));
  };

  const updateCollider = (index: number, collider: Partial<CustomCollider>) => {
    setTemplateData(prev => {
      const updatedColliders = [...prev.customColliders];

      // Make sure we maintain the shape type when merging
      const currentCollider = updatedColliders[index];
      const updatedCollider = {
        ...currentCollider,
        ...collider,
        // Preserve the original shape to avoid type conflicts
        shape: collider.shape || currentCollider.shape
      } as CustomCollider;

      updatedColliders[index] = updatedCollider;

      return {
        ...prev,
        customColliders: updatedColliders
      };
    });
  };

  const removeCollider = (index: number) => {
    setTemplateData(prev => ({
      ...prev,
      customColliders: prev.customColliders.filter((_, i) => i !== index)
    }));
  };

  // Handle model upload
  const handleModelUpload = (files: File[]) => {
    if (files.length === 0) return;
    setIsLoading(true);
    // Now we just set loading state, but we don't set the URL yet
    // The actual URL will be set when onFileUpload callback is invoked
  };

  // Handle model upload completion
  const handleModelUploadComplete = (files: { url: string; width?: number; height?: number; _id?: string }[]) => {
    if (files.length > 0) {
      updateTemplate({ modelPath: files[0].url });
    }
    setIsLoading(false);
    // toast.success('Model uploaded successfully');
  };

  // Handle preview image upload
  const handlePreviewUpload = (files: File[]) => {
    if (files.length === 0) return;
    setIsLoading(true);
    // Now we just set loading state, but we don't set the URL yet
    // The actual URL will be set when onFileUpload callback is invoked
  };

  // Handle preview image upload completion
  const handlePreviewUploadComplete = (files: { url: string; width?: number; height?: number; _id?: string }[]) => {
    if (files.length > 0) {
      updateTemplate({ previewImage: files[0].url });
    }
    setIsLoading(false);
    // toast.success('Preview image uploaded');
  };

  // const handleplanImageUpload = (files: File[]) => {
  //   if (files.length === 0) return;
  //   setIsLoading(true);
  // }

  // const handleplanImageUploadComplete = (files: { url: string; width?: number; height?: number; _id?: string }[]) => {
  //   if (files.length > 0) {
  //     updateTemplate({ planImage: files[0].url });
  //   }
  //   setIsLoading(false);
  //   // toast.success('Plane image uploaded');
  // };

  // Save template
  const saveTemplate = async () => {
    setIsLoading(true);
    try {
      if (onSave) {
        await onSave(templateData);
      } else {
        // Fallback to local implementation if no callback provided
        console.log('Template would be saved:', templateData);
        // toast.success('Gallery template saved successfully');
      }
    } catch (error) {
      console.error(error);
      // toast.error('Failed to save gallery template');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GalleryTemplateContext.Provider value={{
      templateData, updateTemplate,
      addCollider, updateCollider, removeCollider,
      isLoading
    }}>
      <div className="flex h-full">
        {/* 3D Preview Panel */}
        <div className="w-2/3 relative bg-gray-900">
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={75} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            {/* <Environment preset="apartment" /> */}
            <Physics gravity={[0, -30, 0]}>
              <GalleryPreview showColliders={showColliders} />
            </Physics>
            <OrbitControls />
          </Canvas>
          <div className="absolute bottom-4 right-4 space-y-2">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-md">
              <Switch
                id="show-colliders"
                checked={showColliders}
                onCheckedChange={setShowColliders}
              />
              <Label htmlFor="show-colliders">Show Colliders</Label>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="w-1/3 bg-white p-4 overflow-y-auto">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Gallery Template Creator</h2>
            <p className="text-gray-600">Design your custom gallery template</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="basic" className="flex-1">Basic Info</TabsTrigger>
              <TabsTrigger value="dimensions" className="flex-1">Dimensions</TabsTrigger>
              <TabsTrigger value="model" className="flex-1">Model</TabsTrigger>
              <TabsTrigger value="artworks" className="flex-1">Artworks</TabsTrigger>
              <TabsTrigger value="colliders" className="flex-1">Colliders</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="mb-4">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={templateData.name || ''}
                  onChange={(e) => updateTemplate({ name: e.target.value })}
                  className={validationErrors?.name ? "border-red-500" : ""}
                />
                {validationErrors?.name && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-description">Description</Label>
                <Textarea
                  id="template-description"
                  value={templateData.description}
                  onChange={(e) => updateTemplate({ description: e.target.value })}
                  placeholder="Describe your gallery template"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Preview Image</Label>
                <FileUploader
                  maxFiles={1}
                  accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                  multiple={false}
                  onFilesChange={handlePreviewUpload}
                  onFileUpload={handlePreviewUploadComplete}

                />
                {templateData.previewImage && (
                  <div className="mt-2 relative w-full aspect-[4/3] rounded-md overflow-hidden border">
                    <Image
                      width={400}
                      height={300}
                      src={templateData.previewImage}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Floor Plane Image</Label>
                {/* <FileUploader
                  maxFiles={1}
                  accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                  multiple={false}
                  onFilesChange={handleplanImageUpload}
                  onFileUpload={handleplanImageUploadComplete}
                /> */}
                {/* {templateData.planImage && (
                  <div className="mt-2 relative w-full aspect-[4/3] rounded-md overflow-hidden border">
                    <Image
                      width={400}
                      height={300}
                      src={templateData.planImage}
                      alt="Floor Plane"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )} */}
                <Label>Floor Plane Image</Label>
                <div className="mt-2 p-4 border rounded-md bg-white">
                  <FloorPlanRenderer
                    dimensions={templateData.dimensions}
                    wallThickness={templateData.wallThickness}
                    customColliders={templateData.customColliders}
                    artworkPlacements={templateData.artworkPlacements}
                    scale={8}
                    className="mx-auto"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  This floor plan is automatically generated based on your gallery dimensions, colliders, and artwork placements.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="is-premium">Premium Template</Label>
                  <Switch
                    id="is-premium"
                    checked={templateData.isPremium}
                    onCheckedChange={(checked) => updateTemplate({ isPremium: checked })}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Mark this template as premium content
                </p>
              </div>
            </TabsContent>

            {/* Dimensions Tab */}
            <TabsContent value="dimensions" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="xAxis">Width (X-Axis): {templateData.dimensions.xAxis}</Label>
                      <Slider
                        id="xAxis"
                        min={10}
                        max={100}
                        step={0.1}
                        value={[templateData.dimensions.xAxis]}
                        onValueChange={(value) => updateTemplate({ dimensions: { ...templateData.dimensions, xAxis: value[0] } })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="yAxis">Height (Y-Axis): {templateData.dimensions.yAxis}</Label>
                      <Slider
                        id="yAxis"
                        min={5}
                        max={50}
                        step={0.1}
                        value={[templateData.dimensions.yAxis]}
                        onValueChange={(value) => updateTemplate({ dimensions: { ...templateData.dimensions, yAxis: value[0] } })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zAxis">Depth (Z-Axis): {templateData.dimensions.zAxis}</Label>
                      <Slider
                        id="zAxis"
                        min={10}
                        max={100}
                        step={0.1}
                        value={[templateData.dimensions.zAxis]}
                        onValueChange={(value) => updateTemplate({ dimensions: { ...templateData.dimensions, zAxis: value[0] } })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="wallHeight">Wall Height: {templateData.wallHeight}</Label>
                      <Slider
                        id="wallHeight"
                        min={1}
                        max={20}
                        step={0.1}
                        value={[templateData.wallHeight]}
                        onValueChange={(value) => updateTemplate({ wallHeight: value[0] })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="wallThickness">Wall Thickness: {templateData.wallThickness}</Label>
                      <Slider
                        id="wallThickness"
                        min={0.1}
                        max={1}
                        step={0.05}
                        value={[templateData.wallThickness]}
                        onValueChange={(value) => updateTemplate({ wallThickness: value[0] })}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Model Tab */}
            <TabsContent value="model" className="space-y-4">
              <div className="space-y-2">
                <Label>3D Model (.glb)</Label>
                <FileUploader
                  maxFiles={1}
                  maxSize={10 * 1024 * 1024} // 10 MB
                  accept={{ 'model/gltf-binary': ['.glb'] }}
                  multiple={false}
                  onFilesChange={handleModelUpload}
                  onFileUpload={handleModelUploadComplete}
                />
              </div>
              {templateData.modelPath && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="modelScale">Model Scale: {templateData.modelScale}</Label>
                    <Slider
                      id="modelScale"
                      min={0.1}
                      max={10}
                      step={0.1}
                      value={[templateData.modelScale]}
                      onValueChange={(value) => updateTemplate({ modelScale: value[0] })}
                    />
                  </div>

                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-medium mb-3">Model Position</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="posX">Position X: {templateData.modelPosition[0].toFixed(2)}</Label>
                          <Slider
                            id="posX"
                            min={-templateData.dimensions.xAxis / 2}
                            max={templateData.dimensions.xAxis / 2}
                            step={0.5}
                            value={[templateData.modelPosition[0]]}
                            onValueChange={(value) => {
                              const newPosition: [number, number, number] = [...templateData.modelPosition];
                              newPosition[0] = value[0];
                              updateTemplate({ modelPosition: newPosition });
                            }}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="posY">Position Y: {templateData.modelPosition[1].toFixed(2)}</Label>
                          <Slider
                            id="posY"
                            min={0}
                            max={templateData.dimensions.yAxis}
                            step={0.5}
                            value={[templateData.modelPosition[1]]}
                            onValueChange={(value) => {
                              const newPosition: [number, number, number] = [...templateData.modelPosition];
                              newPosition[1] = value[0];
                              updateTemplate({ modelPosition: newPosition });
                            }}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="posZ">Position Z: {templateData.modelPosition[2].toFixed(2)}</Label>
                          <Slider
                            id="posZ"
                            min={-templateData.dimensions.zAxis / 2}
                            max={templateData.dimensions.zAxis / 2}
                            step={0.5}
                            value={[templateData.modelPosition[2]]}
                            onValueChange={(value) => {
                              const newPosition: [number, number, number] = [...templateData.modelPosition];
                              newPosition[2] = value[0];
                              updateTemplate({ modelPosition: newPosition });
                            }}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-medium mb-3">Model Rotation</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="rotX">Rotation X: {templateData.modelRotation[0].toFixed(2)}</Label>
                          <Slider
                            id="rotX"
                            min={-Math.PI}
                            max={Math.PI}
                            step={0.01}
                            value={[templateData.modelRotation[0]]}
                            onValueChange={(value) => {
                              const newRotation: [number, number, number] = [...templateData.modelRotation];
                              newRotation[0] = value[0];
                              updateTemplate({ modelRotation: newRotation });
                            }}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="rotY">Rotation Y: {templateData.modelRotation[1].toFixed(2)}</Label>
                          <Slider
                            id="rotY"
                            min={-Math.PI}
                            max={Math.PI}
                            step={0.01}
                            value={[templateData.modelRotation[1]]}
                            onValueChange={(value) => {
                              const newRotation: [number, number, number] = [...templateData.modelRotation];
                              newRotation[1] = value[0];
                              updateTemplate({ modelRotation: newRotation });
                            }}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="rotZ">Rotation Z: {templateData.modelRotation[2].toFixed(2)}</Label>
                          <Slider
                            id="rotZ"
                            min={-Math.PI}
                            max={Math.PI}
                            step={0.01}
                            value={[templateData.modelRotation[2]]}
                            onValueChange={(value) => {
                              const newRotation: [number, number, number] = [...templateData.modelRotation];
                              newRotation[2] = value[0];
                              updateTemplate({ modelRotation: newRotation });
                            }}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
            <TabsContent value="artworks" className="space-y-4">
              <ArtworkPositionEditor />
            </TabsContent>

            {/* Colliders Tab */}
            <TabsContent value="colliders" className="space-y-4">
              <ColliderEditor />
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex gap-3">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setTemplateData(defaultTemplate)}
            >
              Reset
            </Button>
            <Button
              className="w-full"
              onClick={saveTemplate}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Template'}
            </Button>
          </div>
        </div>
      </div>
    </GalleryTemplateContext.Provider>
  );
}