import { useState, forwardRef } from 'react';
import NextImage, { ImageProps as NextImageProps } from 'next/image';

export interface OptimizedImageProps extends Omit<NextImageProps, 'onLoadingComplete'> {
  onLoadingComplete?: (result: { naturalWidth: number; naturalHeight: number }) => void;
  preventSelection?: boolean;
  preventDownload?: boolean;
  preventContextMenu?: boolean;
  renderPlaceholder?: React.ReactNode;
  className?: string;
}

// const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
//   ({ 
//     className = '', 
//     preventSelection = true, 
//     preventDownload = true,
//     preventContextMenu = true,
//     renderPlaceholder,
//     onLoadingComplete,
//     alt,
//     fill,
//     ...props 
//   }, ref) => {
//     const [isLoaded, setIsLoaded] = useState(false);
//     const [error, setError] = useState(false);
//     console.log(props.width, props.height)
//     const handleLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
//       const target = event.target as HTMLImageElement;
//       setIsLoaded(true);
      
//       // Call the legacy onLoadingComplete with the expected format
//       if (onLoadingComplete) {
//         onLoadingComplete({
//           naturalWidth: target.naturalWidth,
//           naturalHeight: target.naturalHeight
//         });
//       }
//     };

//     const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
//       setError(true);
//       props.onError?.(e);
//     };

//     // Custom inline styles for protection features
//     // const containerStyle: React.CSSProperties = {
//     //   position: 'relative',
//     //   display: fill ? 'block' : 'inline-block', // Full block for fill mode
//     //   overflow: 'hidden',
//     //   width: fill ? '100%' : undefined,  // Important for fill mode
//     //   height: fill ? '100%' : undefined, // Important for fill mode
//     // };

//     // Fix TypeScript errors by using proper type values
//     const imageStyle: React.CSSProperties = {
//       // Base styles
//       opacity: isLoaded ? 1 : 0,
//       transition: 'opacity 0.2s ease-in-out',
//       display: error ? 'none' : 'block',
      
//       // Protection styles
//       WebkitUserSelect: preventSelection ? 'none' : undefined,
//       MozUserSelect: preventSelection ? 'none' : undefined,
//       userSelect: preventSelection ? 'none' : undefined,
//       pointerEvents: preventDownload ? 'none' : undefined
//     };

//     // Add these as string literal object for vendor prefixes with TypeScript issues
//     const additionalStyles: Record<string, string> = {
//       ...(preventSelection ? { 
//         msUserSelect: 'none',
//         WebkitTouchCallout: 'none'
//       } : {})
//     };

//     const overlayStyle: React.CSSProperties = {
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       zIndex: 1,
//       pointerEvents: 'auto',
//       cursor: 'default'
//     };

//     const handleContextMenu = preventContextMenu 
//       ? (e: React.MouseEvent) => e.preventDefault() 
//       : undefined;

//     return (
//       <div 
//       // style={containerStyle}
//        onContextMenu={handleContextMenu}>
//         <NextImage
//           ref={ref}
//           alt={alt || "Image"} // Ensure alt is always provided for accessibility
//           draggable={false}
//           fill={fill}
//           {...props}
//           className={className}
//           style={{
//             ...props.style, 
//             // ...imageStyle,
//             ...additionalStyles as any // Use type assertion for vendor prefixes
//           }}
//           onLoad={handleLoad}
//           onError={handleError}
//         />
        
//         {/* Show placeholder while image is loading */}
//         {!isLoaded && !error && renderPlaceholder}
        
//         {/* Transparent overlay to help prevent interactions */}
//         {preventDownload && <div style={overlayStyle} />}
//       </div>
//     );
//   }
// );

const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({ 
    className = '', 
    preventSelection = true, 
    preventDownload = true,
    preventContextMenu = true,
    renderPlaceholder,
    onLoadingComplete,
    alt,
    fill,
    ...props 
  }, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    // console.log(props.width, props.height)
    const handleLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const target = event.target as HTMLImageElement;
      setIsLoaded(true);
      
      // Call the legacy onLoadingComplete with the expected format
      if (onLoadingComplete) {
        onLoadingComplete({
          naturalWidth: target.naturalWidth,
          naturalHeight: target.naturalHeight
        });
      }
    };

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setError(true);
      props.onError?.(e);
    };

    // Custom inline styles for protection features
    // const containerStyle: React.CSSProperties = {
    //   position: 'relative',
    //   display: fill ? 'block' : 'inline-block', // Full block for fill mode
    //   overflow: 'hidden',
    //   width: fill ? '100%' : undefined,  // Important for fill mode
    //   height: fill ? '100%' : undefined, // Important for fill mode
    // };

    // Fix TypeScript errors by using proper type values
    const imageStyle: React.CSSProperties = {
      // Base styles
      opacity: isLoaded ? 1 : 0,
      transition: 'opacity 0.2s ease-in-out',
      display: error ? 'none' : 'block',
      
      // Protection styles
      WebkitUserSelect: preventSelection ? 'none' : undefined,
      MozUserSelect: preventSelection ? 'none' : undefined,
      userSelect: preventSelection ? 'none' : undefined,
      pointerEvents: preventDownload ? 'none' : undefined
    };

    // Add these as string literal object for vendor prefixes with TypeScript issues
    const additionalStyles: Record<string, string> = {
      ...(preventSelection ? { 
        msUserSelect: 'none',
        WebkitTouchCallout: 'none'
      } : {})
    };

    const overlayStyle: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
      pointerEvents: 'auto',
      cursor: 'default'
    };

    const handleContextMenu = preventContextMenu 
      ? (e: React.MouseEvent) => e.preventDefault() 
      : undefined;
    
    return (
      <div 
      // style={containerStyle}
      style={{
        width: '100%',
        height: '100%'
      }}
       onContextMenu={handleContextMenu}>
        <NextImage
          ref={ref}
          alt={alt || "Image"} // Ensure alt is always provided for accessibility
          draggable={false}
          fill={fill}
          {...props}
          className={className}
          style={{
            ...props.style, 
            // ...imageStyle,
            ...additionalStyles as any // Use type assertion for vendor prefixes
          }}
          onLoad={handleLoad}
          onError={handleError}
        />
        
        {/* Show placeholder while image is loading */}
        {!isLoaded && !error && renderPlaceholder}
        
        {/* Transparent overlay to help prevent interactions */}
        {preventDownload && <div style={overlayStyle} />}
      </div>
    );
  }
);


OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;