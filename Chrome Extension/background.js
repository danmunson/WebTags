
/*
chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
  //add link & desc information - send to server

  //chrome.runtime.sendMessage({'highlight': selected, 'path':path, 'url':document.URL}, function(response) {
  //  console.log(response.receipt);
  //});

  sendResponse({'receipt': request.highlight});
});
*/


chrome.runtime.onInstalled.addListener(function() {
    
  chrome.storage.sync.set({userid: '1234'}, function() {
      console.log('Ciao');
    });
    
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'developer.chrome.com'},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

