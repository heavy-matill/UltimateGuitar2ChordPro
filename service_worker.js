/*chrome.tabs.onActivated.addListener(async activeInfo => {
    // display current tab url
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        console.log(tab.url)
    });

    // find tab with certain url?
    const tabs = await chrome.tabs.query({
        url: [
            '*://chords.menees.com/*'
        ]
    });
    console.log(tabs)
    if (tabs.length) {
        //tabs[0].activate();
        setTimeout(() => { chrome.tabs.update(tabs[0].id, { active: true }) }, 1000)
    } else {
        console.log("found none")
        setTimeout(() => { chrome.tabs.create({ url: 'https://chords.menees.com/' }) }, 1000)
    }
});*/
chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({
        url: chrome.runtime.getURL("index.html"),
        active: true
    },
        function (tab) {
            setTimeout(function () {
                chrome.tabs.executeScript(tab.id, { file: "content.js" });
                setTimeout(function () {
                    chrome.tabs.sendMessage(tab.id, { "Active Objects": "elo" });
                }, 1000);
            }, 1000);
        });

    //win.document.getElementById("source").value = "bar"; // Modify that page
    //win.parseUG();
})
