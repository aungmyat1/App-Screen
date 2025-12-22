from PIL import Image, ImageDraw, ImageFont
import io
from typing import List, Dict, Optional

class ImageProcessor:
    FORMATS = {
        'thumbnail': (200, 400),
        'medium': (600, 1200),
        'large': (1080, 2400),
        'original': None
    }
    
    def __init__(self, watermark_text: Optional[str] = None):
        self.watermark_text = watermark_text or "Screenshot Scraper"
    
    async def process_screenshot(
        self,
        image_data: bytes,
        formats: List[str] = ['thumbnail', 'medium', 'original']
    ) -> Dict[str, bytes]:
        """Generate multiple sizes and formats"""
        img = Image.open(io.BytesIO(image_data))
        results = {}
        
        for format_name in formats:
            if format_name == 'original':
                results['original'] = image_data
                continue
            
            size = self.FORMATS[format_name]
            resized = img.copy()
            resized.thumbnail(size, Image.Resampling.LANCZOS)
            
            # Add watermark if enabled
            if self.watermark_text:
                resized = self._add_watermark(resized)
            
            # Convert to WebP for smaller file size
            output = io.BytesIO()
            resized.save(output, format='WEBP', quality=85)
            results[format_name] = output.getvalue()
        
        return results
    
    def _add_watermark(self, image: Image.Image) -> Image.Image:
        """Add watermark to the image"""
        # Make a copy to avoid modifying the original
        watermarked = image.copy()
        width, height = watermarked.size
        
        # Create a transparent overlay for the watermark
        overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)
        
        # Try to use a better font, fallback to default if not available
        try:
            # Try to use a system font
            font = ImageFont.truetype("DejaVuSans.ttf", 24)
        except:
            # Fallback to default font
            font = ImageFont.load_default()
        
        # Calculate text size and position (bottom right corner)
        text = self.watermark_text
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        x = width - text_width - 10  # 10px padding from right
        y = height - text_height - 10  # 10px padding from bottom
        
        # Draw the watermark text
        draw.text((x, y), text, font=font, fill=(255, 255, 255, 128))  # White with 50% opacity
        
        # Composite the overlay onto the image
        watermarked = Image.alpha_composite(watermarked.convert('RGBA'), overlay)
        
        return watermarked.convert('RGB')  # Convert back to RGB for WebP