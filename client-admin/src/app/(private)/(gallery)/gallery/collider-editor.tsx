'use client';

import React, { useState, useContext } from 'react';
import { GalleryTemplateContext } from './gallery-template-creator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';

export default function ColliderEditor() {
  const { templateData, addCollider, updateCollider, removeCollider } = useContext(GalleryTemplateContext);
  const [colliderType, setColliderType] = useState<'box' | 'curved'>('box');
  
  // Default values for new colliders
  const defaultCollider = {
    box: {
      shape: 'box' as const,
      position: [0, 1.5, 0] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      args: [1, 1, 1] as [number, number, number],
      visible: true
    },
    curved: {
      shape: 'curved' as const,
      position: [0, 1.5, 0] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      radius: 1,
      height: 1,
      segments: 32,
      arc: Math.PI * 2,
      visible: true
    }
  };
  
  // Add new collider
  const handleAddCollider = () => {
    addCollider(colliderType === 'box' ? defaultCollider.box : defaultCollider.curved);
  };
  
  // Update collider position
  const updatePosition = (index: number, axis: 0 | 1 | 2, value: number) => {
    const collider = templateData.customColliders[index];
    const newPosition = [...collider.position] as [number, number, number];
    newPosition[axis] = value;
    updateCollider(index, { position: newPosition });
  };
  
  // Update collider rotation
  const updateRotation = (index: number, axis: 0 | 1 | 2, value: number) => {
    const collider = templateData.customColliders[index];
    const newRotation = [...collider.rotation] as [number, number, number];
    newRotation[axis] = value;
    updateCollider(index, { rotation: newRotation });
  };
  
  // Update box collider dimensions
  const updateBoxDimensions = (index: number, axis: 0 | 1 | 2, value: number) => {
    if (templateData.customColliders[index].shape !== 'box') return;
    
    const collider = templateData.customColliders[index];
    if (collider.shape === 'box') {
      const newArgs = [...collider.args] as [number, number, number];
      newArgs[axis] = value;
      updateCollider(index, { args: newArgs });
    }
  };
  
  // Update curved collider properties
  const updateCurvedProperty = (index: number, property: 'radius' | 'height' | 'segments' | 'arc', value: number) => {
    if (templateData.customColliders[index].shape !== 'curved') return;
    
    updateCollider(index, { [property]: value });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Select value={colliderType} onValueChange={(value) => setColliderType(value as 'box' | 'curved')}>
          <SelectTrigger>
            <SelectValue placeholder="Select collider type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="box">Box Collider</SelectItem>
            <SelectItem value="curved">Curved Collider</SelectItem>
          </SelectContent>
        </Select>
        
        <Button onClick={handleAddCollider}>
          <Plus className="mr-1 h-4 w-4" /> Add Collider
        </Button>
      </div>
      
      {templateData.customColliders.length === 0 && (
        <div className="text-center p-4 border border-dashed rounded-lg">
          <p className="text-gray-500">No colliders added yet. Add your first collider above.</p>
        </div>
      )}
      
      {templateData.customColliders.map((collider, index) => (
        <Card key={`collider-${index}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                {collider.shape === 'box' ? 'Box Collider' : 'Curved Collider'} #{index + 1}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => removeCollider(index)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Position Controls */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor={`pos-x-${index}`}>Position X</Label>
                <Input
                  id={`pos-x-${index}`}
                  type="number"
                  value={collider.position[0]}
                  onChange={(e) => updatePosition(index, 0, parseFloat(e.target.value) || 0)}
                  step="0.1"
                />
              </div>
              <div>
                <Label htmlFor={`pos-y-${index}`}>Position Y</Label>
                <Input
                  id={`pos-y-${index}`}
                  type="number"
                  value={collider.position[1]}
                  onChange={(e) => updatePosition(index, 1, parseFloat(e.target.value) || 0)}
                  step="0.1"
                />
              </div>
              <div>
                <Label htmlFor={`pos-z-${index}`}>Position Z</Label>
                <Input
                  id={`pos-z-${index}`}
                  type="number"
                  value={collider.position[2]}
                  onChange={(e) => updatePosition(index, 2, parseFloat(e.target.value) || 0)}
                  step="0.1"
                />
              </div>
            </div>
            
            {/* Rotation Controls */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor={`rot-x-${index}`}>Rotation X</Label>
                <Input
                  id={`rot-x-${index}`}
                  type="number"
                  value={collider.rotation[0]}
                  onChange={(e) => updateRotation(index, 0, parseFloat(e.target.value) || 0)}
                  step="0.1"
                />
              </div>
              <div>
                <Label htmlFor={`rot-y-${index}`}>Rotation Y</Label>
                <Input
                  id={`rot-y-${index}`}
                  type="number"
                  value={collider.rotation[1]}
                  onChange={(e) => updateRotation(index, 1, parseFloat(e.target.value) || 0)}
                  step="0.1"
                />
              </div>
              <div>
                <Label htmlFor={`rot-z-${index}`}>Rotation Z</Label>
                <Input
                  id={`rot-z-${index}`}
                  type="number"
                  value={collider.rotation[2]}
                  onChange={(e) => updateRotation(index, 2, parseFloat(e.target.value) || 0)}
                  step="0.1"
                />
              </div>
            </div>
            
            {/* Box Specific Controls */}
            {collider.shape === 'box' && (
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor={`width-${index}`}>Width</Label>
                  <Input
                    id={`width-${index}`}
                    type="number"
                    value={collider.args[0]}
                    onChange={(e) => updateBoxDimensions(index, 0, parseFloat(e.target.value) || 0.1)}
                    min="0.1"
                    step="0.1"
                  />
                </div>
                <div>
                  <Label htmlFor={`height-${index}`}>Height</Label>
                  <Input
                    id={`height-${index}`}
                    type="number"
                    value={collider.args[1]}
                    onChange={(e) => updateBoxDimensions(index, 1, parseFloat(e.target.value) || 0.1)}
                    min="0.1"
                    step="0.1"
                  />
                </div>
                <div>
                  <Label htmlFor={`depth-${index}`}>Depth</Label>
                  <Input
                    id={`depth-${index}`}
                    type="number"
                    value={collider.args[2]}
                    onChange={(e) => updateBoxDimensions(index, 2, parseFloat(e.target.value) || 0.1)}
                    min="0.1"
                    step="0.1"
                  />
                </div>
              </div>
            )}
            
            {/* Curved Specific Controls */}
            {collider.shape === 'curved' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor={`radius-${index}`}>Radius</Label>
                  <Input
                    id={`radius-${index}`}
                    type="number"
                    value={collider.radius}
                    onChange={(e) => updateCurvedProperty(index, 'radius', parseFloat(e.target.value) || 0.1)}
                    min="0.1"
                    step="0.1"
                  />
                </div>
                <div>
                  <Label htmlFor={`height-${index}`}>Height</Label>
                  <Input
                    id={`height-${index}`}
                    type="number"
                    value={collider.height}
                    onChange={(e) => updateCurvedProperty(index, 'height', parseFloat(e.target.value) || 0.1)}
                    min="0.1"
                    step="0.1"
                  />
                </div>
                <div>
                  <Label htmlFor={`segments-${index}`}>Segments</Label>
                  <Input
                    id={`segments-${index}`}
                    type="number"
                    value={collider.segments}
                    onChange={(e) => updateCurvedProperty(index, 'segments', parseInt(e.target.value) || 8)}
                    min="3"
                    step="1"
                  />
                </div>
                <div>
                  <Label htmlFor={`arc-${index}`}>Arc (radians)</Label>
                  <Input
                    id={`arc-${index}`}
                    type="number"
                    value={collider.arc}
                    onChange={(e) => updateCurvedProperty(index, 'arc', parseFloat(e.target.value) || 0.1)}
                    min="0.1"
                    max={Math.PI * 2}
                    step="0.1"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}