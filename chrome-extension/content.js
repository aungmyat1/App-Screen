// Content script to extract screenshots from Google Play and App Store pages
function extractScreenshots() {
  const screenshots = [];
  
  try {
    // Check if we're on a Google Play page
    if (window.location.href.includes('play.google.com')) {
      // Extract screenshots from Google Play Store
      const imageElements = document.querySelectorAll('img[data-screenshot-url], [data-testid="screenshot"] img, .U9Uidd');
      
      imageElements.forEach(img => {
        if (img.src) {
          screenshots.push({
            url: img.src,
            platform: 'google_play',
            originalSize: img.naturalWidth ? `${img.naturalWidth}x${img.naturalHeight}` : null
          });
        }
      });
    } 
    // Check if we're on an App Store page
    else if (window.location.href.includes('apps.apple.com')) {
      // Extract screenshots from App Store
      const imageElements = document.querySelectorAll('figure.screenshots img');
      
      imageElements.forEach(img => {
        if (img.src) {
          // Convert App Store thumbnail to original size
          let originalUrl = img.src.replace(/\.0\*\d+x\d+\*/, '.1000x1000'); // Try to get larger size
          
          screenshots.push({
            url: originalUrl,
            platform: 'app_store',
            originalSize: img.naturalWidth ? `${img.naturalWidth}x${img.naturalHeight}` : null
          });
        }
      });
    }
  } catch (error) {
    console.error('Error extracting screenshots:', error);
  }
  
  return {
    success: screenshots.length > 0,
    screenshots: screenshots,
    count: screenshots.length
  };
}

// Expose the function to be called by popup.js
window.extractScreenshots = extractScreenshots;