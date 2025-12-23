// popup.js - Handles the popup UI interactions

document.addEventListener('DOMContentLoaded', function() {
  const extractBtn = document.getElementById('extractScreenshots');
  const downloadBtn = document.getElementById('downloadScreenshots');
  const statusDiv = document.getElementById('status');
  let currentScreenshots = [];

  // Check if we're on a supported page
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentUrl = tabs[0].url;
    const supported = currentUrl.includes('play.google.com') || currentUrl.includes('apps.apple.com');
    
    if (!supported) {
      statusDiv.textContent = 'Not on a supported page';
      statusDiv.className = 'status error';
      extractBtn.disabled = true;
    } else {
      statusDiv.textContent = 'Ready to extract screenshots';
    }
  });

  extractBtn.addEventListener('click', async function() {
    statusDiv.textContent = 'Extracting screenshots...';
    statusDiv.className = 'status';
    
    try {
      // Execute content script to extract screenshots
      const results = await chrome.tabs.query({ active: true, currentWindow: true });
      const tab = results[0];
      
      const extracted = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractScreenshots
      });
      
      if (extracted && extracted[0].result.success) {
        currentScreenshots = extracted[0].result.screenshots;
        statusDiv.textContent = `Found ${currentScreenshots.length} screenshots`;
        downloadBtn.disabled = false;
        
        // Store the extracted screenshots for later use
        chrome.storage.local.set({
          currentScreenshots: currentScreenshots,
          currentTab: tab.url
        });
      } else {
        statusDiv.textContent = 'No screenshots found';
        statusDiv.className = 'status error';
      }
    } catch (error) {
      console.error('Error extracting screenshots:', error);
      statusDiv.textContent = 'Error extracting screenshots';
      statusDiv.className = 'status error';
    }
  });

  downloadBtn.addEventListener('click', async function() {
    statusDiv.textContent = 'Processing screenshots...';
    
    try {
      // Retrieve stored screenshots
      const result = await chrome.storage.local.get(['currentScreenshots', 'currentTab']);
      
      if (!result.currentScreenshots || result.currentScreenshots.length === 0) {
        statusDiv.textContent = 'No screenshots to download';
        statusDiv.className = 'status error';
        return;
      }
      
      // Send screenshots to backend API
      const response = await fetch('http://localhost:8000/api/v1/screenshots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('api_token') // if authentication is required
        },
        body: JSON.stringify({
          appUrl: result.currentTab,
          screenshots: result.currentScreenshots
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        statusDiv.textContent = 'Screenshots saved successfully!';
        downloadBtn.disabled = true;
      } else {
        statusDiv.textContent = 'Error saving screenshots';
        statusDiv.className = 'status error';
      }
    } catch (error) {
      console.error('Error saving screenshots:', error);
      statusDiv.textContent = 'Network error saving screenshots';
      statusDiv.className = 'status error';
    }
  });
});