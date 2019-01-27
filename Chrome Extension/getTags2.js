
function getTags(){

    // pull tags from database
    console.log('tag click');

    injectTagActions();

    chrome.runtime.sendMessage({'type':'pullTags',
                                'url':document.URL}, 
        
        function(response) {
            //response is list of tag objects - arbitrarily limited to 20?
            //console.log(response);
            let taglist = response.data;
            let uniqueNodes = {};

            console.log(taglist);

            for(let i = 0; i < taglist.length; i++){
                
                try{
                    let tag = taglist[i];
                    if(!('params' in tag)) {console.log('skip'); continue;}
                    let tagparams = JSON.parse(tag.params);
                    let tagnodeId = tagparams.targetNode + "_" + tagparams.matchText;

                    if(tagnodeId in uniqueNodes){
                        uniqueNodes[tagnodeId].tags.push(tag); 
                    } else {
                        let endNode = findTargetNode(tagparams); // returns node or null if not found
                        console.log('returned node: ' + endNode.nodeName);
                        endNode.style.color = "red";
                        
                        uniqueNodes[tagnodeId] = {'node':endNode, 'tags':[tag]} // .tags is a list of tags assoc. with the node
                    }
                } catch(error){
                    console.error(error);
                    console.log(taglist[i]);
                }
            }

            let nodeKeys = Object.keys(uniqueNodes);

            for(let k = 0; k < nodeKeys.length; k++){
                let tagObj = uniqueNodes[nodeKeys[k]];
                let node = tagObj.node;
                
                addTagToNode(node, tagObj.tags); // add tag boxes to node
                
            }

            console.log(uniqueNodes);

            return;
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

function injectTagActions(){

    let styleStr = `
    /* Tooltip container */
    .tooltip-tags {
        position: relative;
    }
    
    /* Tooltip text */
    .tooltip-tags .tooltip-tags-box {
        visibility: hidden;
        width: 500px;
        height: 300px;
        background-color: #555;
        color: #fff;
        text-align: center;
        padding: 5px 5px 5px 5px;
        border-radius: 6px;
        overflow: scroll;
    
        /* Position the tooltip text */
        position: absolute;
        z-index: 1;
        bottom: 125%;
        left: 0%;
        margin-left: -60px;
    
    }
    
    /* Tooltip arrow */
    .tooltip-tags .tooltip-tags-box::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #555 transparent transparent transparent;
    }
    
    /* Show the tooltip text when you mouse over the tooltip container */
    .tooltip-tags:hover .tooltip-tags-box {
        //visibility: visible;
        //opacity: 1;
    }`;
    
    //let bootstrapNode = "<link rel=\"stylesheet\" type=\"text/css\" href=\"" +
    //                    chrome.runtime.getUrl('bootstrap4/css/bootstrap.min.css') +
    //                    "\" media=\"screen\"/>";

    let jsStr = "";

    let styleNode = document.createElement("style");
    styleNode.innerHTML = styleStr;

    let jsNode = document.createElement("script");
    jsNode.innerHTML = jsStr;

    document.head.appendChild(styleNode);
    document.head.appendChild(jsNode);
    //document.head.appendChild(bootstrapNode);

    return;
}

function addTagToNode(node, tagList){

    node.setAttribute("class", node.className + " tooltip-tags");
    let tagspan = document.createElement("span");
    tagspan.setAttribute("class", "tooltip-tags-box");
    tagspan.innerHTML = "Click for tags";

    node.addEventListener("click", function(){
        implementTagFormat(tagspan, tagList);
    });

    node.onmouseover = function(){ 
        tagspan.style.visibility = "visible";
        tagspan.style.opacity = 1;
    };
    
    node.onmouseout = function(){ 
        if(tagspan.innerHTML == "Click for tags"){
            tagspan.style.visibility = "hidden";
            tagspan.style.opacity = 0;
        }
    };


    node.appendChild(tagspan);

    return;
}

function implementTagFormat(tagspan, tagList){

    // change element dimensions and styling to support tag list

    //create inner HTML of tagspan element
    let htmlStr = "<div><h3>Tags</h3><span class=\"close-tag-box\" align=\"right\">Close</span>";

    htmlStr = htmlStr + "<table class=\"tag-table\">";
    for(let i = 0; i < tagList.length; i++){
        htmlStr = htmlStr + "<tr>"
        let c1 = "<td width=\"10%\">" + "Username" + "</td>";
        let c2 = "<td width=\"80%\">" + tagList[i].linkDesc + "</td>";
        let c3 = "<td id=\"reply-to-tag\"width=\"10%\"> >> </td>";
        htmlStr = htmlStr + c1 + c2 + c3 + "</tr>";
    }

    // add tags information to element

    htmlStr = htmlStr + "</table></div>";
    tagspan.innerHTML = htmlStr;

    let closeButton = tagspan.getElementsByClassName("close-tag-box")[0];
    closeButton.addEventListener("click", function(){
        tagspan.style.visibility = "hidden";
        tagspan.style.opacity = 0;
        resetInnerHtml(tagspan);
    });

    return;
}

function resetInnerHtml(tag){
    tag.innerHTML = "Click for tags";
}



//CALL FUNCTION
getTags();
