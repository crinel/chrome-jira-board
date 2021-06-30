var contextMenus = {};

contextMenus.createJiraLateStories = chrome.contextMenus.create(
    {
        "title": "Jira Late Stories on board"
    }, 
    function(){
        if(chrome.runtime.lastError){
            console.error(chrome.runtime.lastError.message);
        }
    }
    );


function contextMenuHandler(info, tab){
    if(info.menuItemId === contextMenus.createJiraLateStories){
        chrome.tabs.executeScript({
            file: "js/jiraLateStories.js"
        })
    }
}
chrome.contextMenus.onClicked.addListener(contextMenuHandler);