// Client-side image compression and optimization
export class ImageOptimizer {
  static async compressImage(file: File, options: { 
    quality?: number; 
    maxWidth?: number; 
    maxHeight?: number;
    format?: 'jpeg' | 'png' | 'webp';
  } = {}): Promise<Blob> {
    const { quality = 0.8, maxWidth = 1920, maxHeight = 1080, format = 'jpeg' } = options;
    
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob with compression
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Could not compress image'));
            }
            URL.revokeObjectURL(objectUrl);
          },
          `image/${format}`,
          quality
        );
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Could not load image'));
      };
      
      img.src = objectUrl;
    });
  }
  
  static async generateThumbnail(file: File, options: {
    width?: number;
    height?: number;
    quality?: number;
  } = {}): Promise<Blob> {
    const { width = 300, height = 200, quality = 0.7 } = options;
    
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Draw image on canvas (cover fit)
        const imgRatio = img.width / img.height;
        const canvasRatio = width / height;
        let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
        
        if (imgRatio > canvasRatio) {
          // Image is wider than canvas
          drawHeight = height;
          drawWidth = img.width * (height / img.height);
          offsetX = -(drawWidth - width) / 2;
        } else {
          // Image is taller than canvas
          drawWidth = width;
          drawHeight = img.height * (width / img.width);
          offsetY = -(drawHeight - height) / 2;
        }
        
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Could not generate thumbnail'));
            }
            URL.revokeObjectURL(objectUrl);
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Could not load image'));
      };
      
      img.src = objectUrl;
    });
  }
}