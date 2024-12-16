// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('JSON Formatter installed');
});

// Listen for extension icon click
chrome.action.onClicked.addListener(() => {
    // Open the popup
    chrome.action.openPopup();
}); 