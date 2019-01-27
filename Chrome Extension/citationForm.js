

// handle New Citation message from content script
// pull user input
chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    
    let reqObj = {'reqType' : 'null'};
    
    if(request.type == 'newCitationSelection'){
        
        let outLink = $('#citation-url').val();
        let linkDesc = $('#citation-description').val();

        reqObj = {'reqType': 'newTag',
                    'highlightText': request.highlight,
                    'params': request.params,
                    'sourceUrl': request.url,
                    'outLink': outLink,
                    'linkDesc': linkDesc};

    } else if(request.type == 'pullTags'){

        reqObj = {'reqType': 'pullTagsForUrl',
                    'sourceUrl': request.url};
    }

    $.post('https://addCloudFunctionEndpointURLHere',

            reqObj,

            function(data){
                sendResponse(data);
            }, 
            
            'json'
    );

    return true;
});


let tagger = document.getElementById('tag-button');
tagger.onclick = function(element) {
    chrome.tabs.executeScript({file: 'jquery331.min.js'});
    chrome.tabs.executeScript({file: 'getSelection2.js'});
};


let puller = document.getElementById('gettag-button');
puller.onclick = function(element) {
    chrome.tabs.executeScript({file: 'jquery331.min.js'});
    chrome.tabs.executeScript({file: 'getTags2.js'});
};


