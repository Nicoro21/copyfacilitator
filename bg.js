var tabChamps=new Array();
var chk="";
// The onClicked callback function.
function onClickHandler(info, tab) {
	
  mycallback(info, tab,info.menuItemId);
  if (info.menuItemId == "radio1" || info.menuItemId == "radio2") {
    console.log("radio item " + info.menuItemId +
                " was clicked (previous checked state was "  +
                info.wasChecked + ")");
  } else if (info.menuItemId == "checkbox1" || info.menuItemId == "checkbox2") {
    console.log(JSON.stringify(info));
    console.log("checkbox item " + info.menuItemId +
                " was clicked, state is now: " + info.checked +
                " (previous state was " + info.wasChecked + ")");

  } else {
    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));
  }
};

chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
 
});



//background
function mycallback(info, tab,menuItemId) {
    console.log("callback");
    console.log(menuItemId);

    switch (menuItemId) {
      case 'copier':
          chrome.tabs.sendRequest(tab.id, {name:"copier", id:menuItemId, valeur : tabChamps[menuItemId]}, function(reponsecopier) {
            console.log("valeur de l'elt copier :"+ reponsecopier); 
            chk=reponsecopier;      
          });
        break;
     
      case 'coller':
          chrome.tabs.sendRequest(tab.id, {name:"coller", id:menuItemId, valeur : chk}, function(clickedEl) {
            console.log("valeur de l'elt coller :"+ clickedEl.value,menuItemId);       
          });
        break;
      default:
          chrome.tabs.sendRequest(tab.id, {name:"getClickedEl", id:menuItemId, valeur : tabChamps[menuItemId]}, function(clickedEl) {
            console.log("valeur de l'elt :"+ clickedEl.value,menuItemId);       
          });
    }

}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.action == "rempli"){
        console.log(request.data);
        tabChamps=new Array();
        chrome.contextMenus.removeAll();

          // Create a parent item and two children.
        chrome.contextMenus.create({"title": "Insérer", "id": "parent",contexts :["editable"]});
        
        for (var i = 0; i < request.data.length; i++) {
          tabChamps[request.data[i].id] =request.data[i].valeur,
          chrome.contextMenus.create( {"title": request.data[i].nom, "parentId": "parent", contexts :["editable"], "id": request.data[i].id});
        }    
      sendResponse({farewell: "goodbye"});
      };
        chrome.contextMenus.create({"title": "Copier les cases", "id": "copy",contexts :["page"],"id": "copier"});
        chrome.contextMenus.create({"title": "Coller les cases", "id": "paste",contexts :["page"],"id": "coller"});
  });