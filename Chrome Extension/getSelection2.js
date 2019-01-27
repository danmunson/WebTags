//getSelection2

function getSelectionParams(){
    let selection = document.getSelection();
    if(!selection.toString().length) return false;
    
    let selectionStart = selection.getRangeAt(0).startContainer;
    let targetNode = null;
    if(selectionStart.nodeType == 3){
        targetNode = selectionStart.parentNode;
    } else {
        targetNode = selectionStart;
    }

    let matchText = targetNode.textContent.trim();
    let selectionText = selection.toString().trim();
    
    return {'targetNode':targetNode.nodeName.toUpperCase(),
            'matchText':matchText,
            'selectionText':selectionText};
}

function sendSelection(){
    
    console.log('initiate send');
    
    // get the path leading to the selection node
    let selectionParams = getSelectionParams();
    let params = JSON.stringify(selectionParams);

    if(selectionParams.selectionText.length <= 0) return;

    //send to backgrund.js
    chrome.runtime.sendMessage({'params':params, 
                                'url':document.URL,
                                'type':'newCitationSelection'},

        function(response) {
            
            let params = JSON.parse(response.data);
            let targetNode = findTargetNode(params); // returns node or null if not found

            //testing
            console.log('returned node: ' + targetNode.nodeName);
            targetNode.style.color = "green";
        }
    );
}

function findTargetNode(params){
    let placementNode = null;
    console.log(params.targetNode);
    let potentials = document.getElementsByTagName(params.targetNode);
    for(let i = 0; i < potentials.length; i++){
        if(potentials[i].textContent.indexOf(params.matchText) > -1){
            placementNode = potentials[i];
        }
    }
    
    if(!(placementNode !== null)) {console.log(potentials.length); return;}

    return placementNode;
}

sendSelection();