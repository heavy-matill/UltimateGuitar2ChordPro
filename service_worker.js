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
chrome.runtime.onMessage.addListener( // this is the message listener
    async function (request, sender, sendResponse) {
        await convert(request);
    }
);

chrome.action.onClicked.addListener(async () =>
    convert({ "chordSheet": "elo", "artist": "Suicide Silence", "bpm": "120", "title": "That song!" })
);

async function convert(dictMessage) {
    let tab
    // local
    // const url = chrome.runtime.getURL("index.html");
    // hosted
    const url = "https://ultimate-guitar-2-chord-pro.web.app/"
    // check if tab exists:
    const tabs = await chrome.tabs.query({
        url: [url]
    });
    if (tabs.length) {
        tab = tabs[0]
        chrome.tabs.update(tab.id, { active: true })
    } else {
        tab = await chrome.tabs.create({
            url: url,
            active: true
        })
    }
    setTimeout(() => chrome.tabs.sendMessage(tab.id, dictMessage), 1000);
}
