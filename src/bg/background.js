// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
// chrome.extension.onMessage.addListener(
//   function(request, sender, sendResponse) {
//   	chrome.pageAction.show(sender.tab.id);
//     sendResponse();
//   });

let client_id = null;

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

function useClientId(url) {
  var urlParams = new URLSearchParams(url);
  client_id = urlParams.get("client_id");
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.cmd == "request-client-id") {
      sendResponse({ result: client_id });
    }
    // Note: Returning true is required here!
    //  ref: http://stackoverflow.com/questions/20077487/chrome-extension-message-passing-response-not-sent
    return true; 
  });


(function () {
  const networkFilters = {
    urls: [
      "*://api.soundcloud.com/*",
      "*://api-v2.soundcloud.com/*client_id*",
    ]
  };

  const useClientIdDebounced = debounce(useClientId, 3000);

  chrome.webRequest.onBeforeRequest.addListener((details) => {
    const { tabId, requestId, url } = details;

    useClientIdDebounced(url)

  }, networkFilters);

}());