var contextMenus = {};

// execute script when using Ctrl+Shift+L
chrome.browserAction.onClicked.addListener(tab => {
    chrome.tabs.executeScript(tab.id, {
        file: "js/jiraLateStories.js"
    });
});

contextMenus.createJiraLateStories = chrome.contextMenus.create(
    {
        title: "Jira Late Stories on Board",
        id: "jiraStories"
    },
    function () {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        }
    }
);

chrome.contextMenus.create({
    title: "🟨 View highlights",
    id: "view",
    parentId: contextMenus.createJiraLateStories
});
chrome.contextMenus.create({
    title: "🛠 Settings",
    id: "settings",
    parentId: contextMenus.createJiraLateStories
});

function contextMenuHandler(info, tab) {
    switch (info.menuItemId) {
        case "view": {
            chrome.tabs.executeScript({
                file: "js/jiraLateStories.js"
            });
            break;
        }
        case "settings": {
            chrome.tabs.executeScript({
                file: "js/settings.js"
            });
            break;
        }
    }
}

chrome.contextMenus.onClicked.addListener(contextMenuHandler);
