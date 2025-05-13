'use client';

import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash } from 'lucide-react';
import { GalleryTemplateContext } from './gallery-template-creator';
import { calculateWallArtworkPositions } from '@/utils/room-helper';

// Type for wall artwork settings
type WallSettings = {
  count: number;
  heightPosition: number;
};

// Wall configuration type
type WallConfigs = {
  front: WallSettings;
  back: WallSettings;
  left: WallSettings;
  right: WallSettings;
};

type ArtworkPlacement = {
  position: [number, number, number];
  rotation: [number, number, number];
};

export default function ArtworkEditor() {
  const { templateData, updateTemplate } = useContext(GalleryTemplateContext);
 
  // Wall configurations for standard walls with defaults
  const [wallConfigs, setWallConfigs] = React.useState<WallConfigs>({
    front: { count: 0, heightPosition: templateData.wallHeight / 2 },
    back: { count: 0, heightPosition: templateData.wallHeight / 2 },
    left: { count: 0, heightPosition: templateData.wallHeight / 2 },
    right: { count: 0, heightPosition: templateData.wallHeight / 2 }
  });

  // Track custom artworks separately - Khởi tạo từ templateData.artworks
  const [customArtworkPlacements, setCustomArtworkPlacements] = useState<ArtworkPlacement[]>(() => {
    // Sử dụng dữ liệu có sẵn từ template
    return [...(templateData.artworkPlacements || [])];
  });

  // Effect để chạy một lần khi component mount, xóa bỏ các artwork từ wall configs
  useEffect(() => {
    // Chỉ chạy khi khởi tạo component
    if (customArtworkPlacements.length > 0) {
      // Đảm bảo các artwork hiện tại được giữ lại
      updateTemplate({ artworkPlacements: customArtworkPlacements });
    }
  }, []);
  
  // Update wall configurations and regenerate positions
  const updateWallConfig = (
    wall: keyof WallConfigs, 
    field: keyof WallSettings, 
    value: number
  ) => {
    const newConfig = { 
      ...wallConfigs, 
      [wall]: { ...wallConfigs[wall], [field]: value }
    };
    
    setWallConfigs(newConfig);
  };
  
  // Effect to regenerate all artwork positions when wall configs change
  useEffect(() => {
    regenerateArtworkPositions();
  }, [wallConfigs]);
  
  // Generate all artwork positions based on wall configurations and custom artworks
  const regenerateArtworkPositions = () => {
    const generatedArtworkPlacements: ArtworkPlacement[] = [];
    
    // Generate positions for each standard wall
    Object.entries(wallConfigs).forEach(([wallType, config]) => {
      if (config.count > 0) {
        // Calculate positions for this wall
        const result = calculateWallArtworkPositions({
          wallType: wallType as 'front' | 'back' | 'left' | 'right',
          wallDimension: (wallType === 'front' || wallType === 'back')
            ? templateData.dimensions.xAxis
            : templateData.dimensions.zAxis,
          artworkCount: config.count,
          roomDimensions: templateData.dimensions,
          heightPosition: config.heightPosition
        });
        
        // Add all positions to the generated array
        for (let i = 0; i < result.positions.length; i++) {
          generatedArtworkPlacements.push({
            position: result.positions[i],
            rotation: result.rotations[i]
          });
        }
      }
    });
    
    // Combine with custom artworks
    const allArtworkPlacements = [...generatedArtworkPlacements, ...customArtworkPlacements];
    
    // Update the template with all artwork placements
    updateTemplate({ artworkPlacements: allArtworkPlacements });
  };
  
  // Add new custom artwork
  const addCustomArtwork = () => {
    const newArtworkPlacement = {
      position: [0, templateData.wallHeight / 2, 0] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number]
    };
    
    const updatedCustomArtworkPlacements = [...customArtworkPlacements, newArtworkPlacement];
    setCustomArtworkPlacements(updatedCustomArtworkPlacements);
    
    // Cập nhật template với tất cả artworks
    updateTemplate({
      artworkPlacements: [...(templateData.artworkPlacements || []), newArtworkPlacement]
    });
  };
  
  // Remove custom artwork
  const removeCustomArtwork = (index: number) => {
    const updatedCustomArtworkPlacements = customArtworkPlacements.filter((_, i) => i !== index);
    setCustomArtworkPlacements(updatedCustomArtworkPlacements);
    
    // Cập nhật template với custom artworks mới
    updateTemplate({ 
      artworkPlacements: updatedCustomArtworkPlacements 
    });
  };
  
  // Update custom artwork position
  const updateCustomPosition = (index: number, axis: 0 | 1 | 2, value: number) => {
    const updatedCustomArtworkPlacements = [...customArtworkPlacements];
    const newPosition = [...updatedCustomArtworkPlacements[index].position] as [number, number, number];
    newPosition[axis] = value;
    updatedCustomArtworkPlacements[index] = {
      ...updatedCustomArtworkPlacements[index],
      position: newPosition
    };
    
    setCustomArtworkPlacements(updatedCustomArtworkPlacements);
    
    // Cập nhật template với custom artworks mới
    updateTemplate({ artworkPlacements: updatedCustomArtworkPlacements });
  };
  
  // Update custom artwork rotation
  const updateCustomRotation = (index: number, axis: 0 | 1 | 2, value: number) => {
    const updatedCustomArtworkPlacements = [...customArtworkPlacements];
    const newRotation = [...updatedCustomArtworkPlacements[index].rotation] as [number, number, number];
    newRotation[axis] = value;
    updatedCustomArtworkPlacements[index] = {
      ...updatedCustomArtworkPlacements[index],
      rotation: newRotation
    };
    
    setCustomArtworkPlacements(updatedCustomArtworkPlacements);
    
    // Cập nhật template với custom artworks mới
    updateTemplate({ artworkPlacements: updatedCustomArtworkPlacements });
  };
  
  // Render a wall configuration section
  const renderWallConfig = (wall: keyof WallConfigs, label: string) => {
    return (
      <div className="space-y-4 p-4">
        <h3 className="text-lg font-semibold">{label} Wall</h3>
        
        <div>
          <div className="flex justify-between mb-2">
            <Label>Number of artworks: {wallConfigs[wall].count}</Label>
          </div>
          <Slider 
            value={[wallConfigs[wall].count]} 
            onValueChange={([value]) => updateWallConfig(wall, 'count', value)}
            min={0}
            max={8}
            step={1}
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <Label>Height Position: {wallConfigs[wall].heightPosition.toFixed(1)}</Label>
          </div>
          <Slider 
            value={[wallConfigs[wall].heightPosition]} 
            onValueChange={([value]) => updateWallConfig(wall, 'heightPosition', value)}
            min={1}
            max={templateData.wallHeight - 1}
            step={0.1}
          />
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="custom">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="back">Back Wall</TabsTrigger>
          <TabsTrigger value="front">Front Wall</TabsTrigger>
          <TabsTrigger value="left">Left Wall</TabsTrigger>
          <TabsTrigger value="right">Right Wall</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>
        
        <TabsContent value="back">{renderWallConfig('back', 'Back')}</TabsContent>
        <TabsContent value="front">{renderWallConfig('front', 'Front')}</TabsContent>
        <TabsContent value="left">{renderWallConfig('left', 'Left')}</TabsContent>
        <TabsContent value="right">{renderWallConfig('right', 'Right')}</TabsContent>
        
        <TabsContent value="custom">
          <div className="space-y-4 p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Custom Artwork Positions</h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={addCustomArtwork}
              >
                <Plus className="h-4 w-4" /> Add Custom
              </Button>
            </div>
            
            {customArtworkPlacements.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No custom artworks added yet.</p>
            ) : (
              <div className="space-y-4">
                {customArtworkPlacements.map((artwork, index) => (
                  <Card key={`custom-artwork-${index}`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">Custom Artwork {index + 1}</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeCustomArtwork(index)}
                          className="text-red-500"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Position</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {['X', 'Y', 'Z'].map((axis, axisIndex) => (
                            <div key={`pos-${axis}-${index}`}>
                              <Label htmlFor={`artwork-${index}-pos-${axis}`}>{axis}</Label>
                              <Input
                                id={`artwork-${index}-pos-${axis}`}
                                type="number"
                                step="0.1"
                                value={artwork.position[axisIndex]}
                                onChange={(e) => updateCustomPosition(
                                  index, 
                                  axisIndex as 0 | 1 | 2, 
                                  parseFloat(e.target.value) || 0
                                )}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Rotation (radians)</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {['X', 'Y', 'Z'].map((axis, axisIndex) => (
                            <div key={`rot-${axis}-${index}`}>
                              <Label htmlFor={`artwork-${index}-rot-${axis}`}>{axis}</Label>
                              <Input
                                id={`artwork-${index}-rot-${axis}`}
                                type="number"
                                step="0.1"
                                min={-Math.PI * 2}
                                max={Math.PI * 2}
                                value={artwork.rotation[axisIndex]}
                                onChange={(e) => updateCustomRotation(
                                  index, 
                                  axisIndex as 0 | 1 | 2, 
                                  parseFloat(e.target.value) || 0
                                )}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="p-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-600 mb-2">
          Total Artwork Count: {customArtworkPlacements.length}
        </h4>
      </div>
    </div>
  );
}