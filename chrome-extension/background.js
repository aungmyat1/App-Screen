// Background script for the Chrome extension

// Set up the extension icon badge with initial text
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "",
  });
});

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractScreenshots") {
    // Forward the message to the content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "extractScreenshots"}, function(response) {
        sendResponse(response);
      });
    });
    return true; // Keep the message channel open for async response
  }
  
  if (request.action === "saveToAPI") {
    // Send screenshots to the backend API
    fetch('http://localhost:8000/api/v1/screenshots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request.data)
    })
    .then(response => response.json())
    .then(data => {
      sendResponse({success: true, data: data});
    })
    .catch(error => {
      console.error('Error saving to API:', error);
      sendResponse({success: false, error: error.message});
    });
    
    return true; // Keep the message channel open for async response
  }
});

// Listen for tab updates to update the extension icon state
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if the tab is on a supported site
    if (tab.url.includes('play.google.com') || tab.url.includes('apps.apple.com')) {
      chrome.action.enable(tabId);
      chrome.action.setBadgeText({
        tabId: tabId,
        text: "",
      });
    } else {
      chrome.action.disable(tabId);
      chrome.action.setBadgeText({
        tabId: tabId,
        text: "X",
      });
    }
  }
});