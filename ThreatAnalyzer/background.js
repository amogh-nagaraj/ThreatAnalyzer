// background.js

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({ url: chrome.runtime.getURL('index.html') }, function(tab) {
    // Listener to execute code when the tab has finished loading
    chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
      if (tabId === tab.id && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener); // Remove listener after first load
        // Send message to the newly created tab to start scanning
        chrome.tabs.sendMessage(tabId, { action: "initializeThreatAnalyzer" });
      }
    });
  });
});

// Listener for messages from landing.html or other content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "scanDomain") {
    var domain = request.domain;
    var apiKey = "40f1ca801a9d474720de9d23b21e327f67ade57a9f30cfe687081d7ce979838d"; // Replace with your VirusTotal API v3 key
    var apiUrl = `https://www.virustotal.com/api/v3/domains/${encodeURIComponent(domain)}`;

    fetch(apiUrl, {
      headers: {
        'x-apikey': apiKey
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        sendResponse({ success: true, result: data });
      })
      .catch(error => {
        console.error('Error fetching VirusTotal API:', error);
        sendResponse({ success: false, error: error.message });
      });

    // Return true to indicate that sendResponse will be called asynchronously
    return true;
  }
});
