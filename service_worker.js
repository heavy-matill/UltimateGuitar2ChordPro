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

chrome.action.onClicked.addListener(async () => {
    let tab
    const localURL = chrome.runtime.getURL("index.html");
    // check if tab exists:
    const tabs = await chrome.tabs.query({
        url: [localURL]
    });
    if (tabs.length) {
        tab = tabs[0]
        chrome.tabs.update(tab.id, { active: true })
    } else {
        tab = await chrome.tabs.create({
            url: localURL,
            active: true
        })
    }
    chrome.tabs.sendMessage(tab.id, { "ug": "elo" });
});
