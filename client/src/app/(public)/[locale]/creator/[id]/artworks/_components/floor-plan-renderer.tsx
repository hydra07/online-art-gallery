/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArtworkPlacement, CustomCollider } from '@/types/new-gallery';
import React, { useRef, useEffect } from 'react';

interface FloorPlanRendererProps {
  dimensions: {
    xAxis: number;
    yAxis: number;
    zAxis: number;
  };
  wallThickness: number;
  customColliders?: CustomCollider[];
  artworkPlacements?: ArtworkPlacement[];
  scale?: number;
  className?: string;
  showGrid?: boolean;
  highlightedPosition?: number;
  onPositionClick?: (index: number) => void;
}

export function FloorPlanRenderer({
  dimensions,
  wallThickness,
  customColliders = [],
  artworkPlacements = [],
  scale = 10, // pixels per unit
  className = '',
  showGrid = true,
  highlightedPosition = -1,
  onPositionClick,
}: FloorPlanRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Calculate canvas dimensions with some padding
  const padding = scale * 2;
  const canvasWidth = dimensions.xAxis * scale + padding * 2;
  const canvasHeight = dimensions.zAxis * scale + padding * 2;
  
  // Function to convert 3D coordinates to 2D canvas coordinates
  const toCanvasCoords = (x: number, z: number): [number, number] => {
    // Convert from gallery space to canvas space with padding
    const canvasX = (x + dimensions.xAxis / 2) * scale + padding;
    const canvasY = (z + dimensions.zAxis / 2) * scale + padding;
    return [canvasX, canvasY];
  };

  // Function to convert canvas coordinates back to 3D space (for click handling)
  const fromCanvasCoords = (canvasX: number, canvasY: number): [number, number] => {
    const x = (canvasX - padding) / scale - dimensions.xAxis / 2;
    const z = (canvasY - padding) / scale - dimensions.zAxis / 2;
    return [x, z];
  };
  
  // Click handler to detect which position was clicked
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onPositionClick) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if any position was clicked (using a proximity threshold)
    const threshold = 10; // Pixels
    
    for (let i = 0; i < artworkPlacements.length; i++) {
      const [canvasX, canvasY] = toCanvasCoords(
        artworkPlacements[i].position[0],
        artworkPlacements[i].position[2]
      );
      
      const distance = Math.sqrt(
        Math.pow(x - canvasX, 2) + Math.pow(y - canvasY, 2)
      );
      
      if (distance <= threshold) {
        onPositionClick(i);
        return;
      }
    }
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set background
    ctx.fillStyle = '#f9f9f9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      
      // Draw vertical grid lines
      for (let x = 0; x <= dimensions.xAxis; x++) {
        const [canvasX] = toCanvasCoords(x - dimensions.xAxis / 2, 0);
        ctx.beginPath();
        ctx.moveTo(canvasX, padding);
        ctx.lineTo(canvasX, canvasHeight - padding);
        ctx.stroke();
      }
      
      // Draw horizontal grid lines
      for (let z = 0; z <= dimensions.zAxis; z++) {
        const [_, canvasY] = toCanvasCoords(0, z - dimensions.zAxis / 2);
        ctx.beginPath();
        ctx.moveTo(padding, canvasY);
        ctx.lineTo(canvasWidth - padding, canvasY);
        ctx.stroke();
      }
    }
    
    // Draw floor
    ctx.fillStyle = '#f0f0f0';
    const [floorX, floorY] = toCanvasCoords(-dimensions.xAxis / 2, -dimensions.zAxis / 2);
    ctx.fillRect(
      floorX, 
      floorY, 
      dimensions.xAxis * scale, 
      dimensions.zAxis * scale
    );
    
    // Draw outer walls
    ctx.strokeStyle = '#333';
    ctx.lineWidth = wallThickness * scale;
    ctx.strokeRect(
      floorX + ctx.lineWidth / 2, 
      floorY + ctx.lineWidth / 2, 
      dimensions.xAxis * scale - ctx.lineWidth, 
      dimensions.zAxis * scale - ctx.lineWidth
    );
    
    // Draw custom colliders
    ctx.strokeStyle = '#666';
    ctx.lineWidth = Math.max(1, wallThickness * scale * 0.7);
    
    customColliders.forEach(collider => {
      if (collider.shape === 'box') {
        const [x, _, z] = collider.position || [0, 0, 0];
        const [_x, rotationY, _z] = collider.rotation || [0, 0, 0];
        const [width, _height, depth] = collider.args || [0, 0, 0];
        
        ctx.save();
        
        const [canvasX, canvasY] = toCanvasCoords(x, z);
        ctx.translate(canvasX, canvasY);
        ctx.rotate(rotationY);
        
        // Draw the box with a slightly lighter fill
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(
          -width * scale / 2,
          -depth * scale / 2,
          width * scale,
          depth * scale
        );
        
        ctx.strokeRect(
          -width * scale / 2,
          -depth * scale / 2,
          width * scale,
          depth * scale
        );
        
        ctx.restore();
      } else if (collider.shape === 'curved') {
        const [x, _, z] = collider.position || [0, 0, 0];
        const [canvasX, canvasY] = toCanvasCoords(x, z);
        const radius = collider.radius || 1;
        // const startAngle = collider.startAngle || 0;
        const startAngle = 0;
        // const endAngle = collider.endAngle || Math.PI * 2;
        const endAngle = Math.PI * 2;
        
        ctx.fillStyle = '#e0e0e0';
        ctx.beginPath();
        ctx.arc(
          canvasX,
          canvasY,
          radius * scale,
          startAngle,
          endAngle
        );
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(
          canvasX,
          canvasY,
          radius * scale,
          startAngle,
          endAngle
        );
        ctx.stroke();
      }
    });
    
    // Draw artwork placements
    artworkPlacements.forEach((placement, index) => {
      const [x, _, z] = placement.position;
      const [_x, rotationY, _z] = placement.rotation;
      const [canvasX, canvasY] = toCanvasCoords(x, z);
      
      // Check if this is the highlighted position
      const isHighlighted = index === highlightedPosition;
      
      // Draw position marker with number
      const radius = isHighlighted ? 12 : 10;
      
      // Draw circle background
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, radius, 0, Math.PI * 2);
      ctx.fillStyle = isHighlighted ? '#1e40af' : '#3b82f6';
      ctx.fill();
      
      // Draw border
      ctx.strokeStyle = isHighlighted ? '#bfdbfe' : '#60a5fa';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw position number
      ctx.fillStyle = 'white';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${index + 1}`, canvasX, canvasY);
      
    });
    
    // Add scale indicator and measurements
    ctx.fillStyle = '#666';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    
    // Draw width dimension
    const widthText = `${dimensions.xAxis.toFixed(1)}`;
    ctx.fillText(widthText, canvasWidth / 2, canvas.height - padding / 2);
    
    // Draw height dimension
    ctx.save();
    ctx.translate(padding / 2, canvasHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${dimensions.zAxis.toFixed(1)}`, 0, 0);
    ctx.restore();
    
    // Draw scale indicator
    const scaleBarLength = scale; // 1 meter
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvasWidth - padding - scaleBarLength, canvasHeight - padding / 2 - 10);
    ctx.lineTo(canvasWidth - padding, canvasHeight - padding / 2 - 10);
    ctx.stroke();
    
    ctx.fillText('1', canvasWidth - padding - scaleBarLength / 2, canvasHeight - padding / 2 - 15);
    
  }, [dimensions, wallThickness, customColliders, artworkPlacements, scale, canvasWidth, canvasHeight, showGrid, highlightedPosition]);
  
  // Update the return statement to include scrollable container
return (
  <div className={`relative ${className}`}>
    <div className="overflow-auto max-h-[600px] max-w-full rounded-md shadow-sm">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onClick={onPositionClick ? handleCanvasClick : undefined}
        style={{ cursor: onPositionClick ? 'pointer' : 'default' }}
      />
    </div>
    <div className="text-xs text-gray-500 mt-1 text-center">
      Floor plan showing {artworkPlacements.length} artwork positions
    </div>
  </div>
);
}