//Browser side
//Collect URL & Description, Send to server

function getSelectionParent(){
    let selection = document.getSelection();
    if(!selection.toString().length)
        return false;
    else
        return selection.focusNode.parentNode; // add parent node if necessary, but not ideal since it can cause issues
}

function getSelectionParams(node){
    let pnodeType = node.nodeName.toUpperCase();
    let html = node.innerHTML.toString().trim();

    return JSON.stringify({'pnodeType':pnodeType,
                           'html':html});
}

function sendSelection(){
    
    console.log('initiate send');
    
    // get the path leading to the selection node
    let selected = window.getSelection().toString();
    let selectionNode = getSelectionParent();
    let params = JSON.stringify(getSelectionParams(selectionNode));

    if(selected.length <= 0) return;

    //send to backgrund.js
    chrome.runtime.sendMessage({'highlight': selected,
                                'params':params, 
                                'url':document.URL,
                                'type':'newCitationSelection'}, 
        function(response) {
            
            let params = JSON.parse(response.data);
            let endNode = findEndNode(JSON.parse(params)); // returns node or null if not found

            //testing
            console.log('returned node: ' + endNode.nodeName);
            endNode.style.color = "green";
        }
    );
}

//returns null if a matching node is not found
function findEndNode(params){

    let returnNode = null;
    console.log(typeof params);
    //console.log(Object.keys(params));
    let potentials = document.getElementsByTagName(params['pnodeType']);
    console.log(potentials);
    for(let i = 0; i < potentials.length; i++){
        let node = potentials[i];
        console.log(node.innerHTML);
        if(node.innerHTML.toString().trim() == params['html']) { returnNode = node; break; }
    }

    return returnNode;
}


sendSelection();




