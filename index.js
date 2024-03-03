const ug = `
[Verse Riff]
 
G|----------------------------------------------------------------------|
D|------5-----------------5-----------------5-----------------5---------| (x10)
A|-7--7---7-5-3-2--/-7--7---7-5-3-2--/-7--7---7-5-3-2--/-7--7---7-5-3-2-|
E|-0-----------------0-----------------0-----------------0--------------|


[Pre/Post-Chorus Riff]

e|------------------0-0-0-0-0-0-0-0-|
B|------------------2-2-2-2-2-2-2-2-|
G|-4-4-4-4-4-4-4-4--2-2-2-2-2-2-2-2-|
D|-5-5-5-5-5-5-5-5--2-2-2-2-2-2-2-2-|
A|-5-5-5-5-5-5-5-5--0-0-0-0-0-0-0-0-|
E|-3-3-3-3-3-3-3-3------------------|

(Bass)
G|----------------------------------|
D|----------------------------------|
A|------------------0-0-0-0-0-0-0-0-|
E|-3-3-3-3-3-3-3-3------------------|


[Chorus Riff]
(Gtr w/Distortion + 3 string slide)

e|-0----------------------|
B|-8--8/-12-\-8-\\7-\\5--\\4-|
G|-9--9/-12-\-9-\\7-\\5--\\4-|
D|-9--9/-12-\-9-\\7-\\5--\\4-|
A|-7--7/-10-\-7-\\5-\\3--\\2-|
E|-0----------------------|

(Bass)
G|----------------|
D|------5---------|
A|-7--7---7-5-3-2-|
E|-0--------------|

(Gtr)
e|-0----------------------------|
B|-8--8/-12-\-8-\\7-\\5-/7-\-5-\\4-|
G|-9--9/-12-\-9-\\7-\\5-/7-\-5-\\4-|
D|-9--9/-12-\-9-\\7-\\5-/7-\-5-\\4-|
A|-7--7/-10-\-7-\\5-\\3-/5-\-3-\\2-|
E|-0----------------------------|

(Bass)
G|--------------------|
D|------5-------------|
A|-7--7---7-5-3-5-3-2-|
E|-0------------------|


[Verse 1]
        Em            G  C  B
I'm gonna fight 'em off
                Em            G       C    B
A seven nation army couldn't hold me back
            Em         G  C  B
They're gonna rip it off
            Em           G       C    B
Taking their time right behind my back
        Em           G       C
And I'm talking to myself at night
        B        Em  G  C  B
Because I can't forget
Em             G          C
Back and forth through my mind
        B   Em    G  C  B
Behind a cigarette
    G                      A
And a message coming from my eyes says leave it alone

[Instrumental Chorus]
Em G C B x4
G   A

[Interlude]
Em G C B x4

[Verse 2]
            Em            G  C  B
Don't wanna hear about it
                Em            G       C    B
Every single one's got a story to tell
        Em            G  C  B
Everyone knows about it
                Em            G       C    B
From the Queen of England to the hounds of Hell
        Em            G  C  B
And if I catch it coming back my way
                Em            G       C    B
I'm gonna serve it to you
        Em            G  C  B
And that ain't what you want to hear
                Em            G       C    B
But that's what I'll do
    G                      A
And a feeling coming from my bones says find a home

[Solo]
Em G C B x8
G   A

[Interlude]
Em G C B x4

[Verse 3]
            Em      G  C  B
I'm goin' to Wichita
                Em            G       C    B
Far from this opera, forever more
        Em             G  C  B
I'm gonna work the straw
                Em            G       C    B
Make the sweat drip out of every pore
        Em            G  C  B
And I'm bleeding and I'm bleeding and I'm bleeding
                Em            G       C    B
Right before the Lord
        Em              G            C
All the words are gonna bleed from me
            B         Em   G  C  B
And I will think no more
        G                     A
And the stains coming from my blood tell me go back home

[Instrumental Chorus]
Em G C B x4
Em


**************************

| /  slide up
| \  slide down

**************************
`

const elMeta = document.getElementById("meta")
const elSrc = document.getElementById('source')
const elCPro = document.getElementById('chordpro')
const elRndr = document.getElementById('render')

function parseUG() {
        console.log("parseUG")
        // parse meta
        let strMeta = ""
        for (el of elMeta.children) {
                if (el.children[0]?.checked) {
                        let key = el.children[1].innerText
                        let val = el.children[2].value
                        strMeta = strMeta + `{${key}: ${val}}\n`
                }
        }
        // parse chords and text
        elSrc.parentNode.dataset.value = elSrc.value
        let parser = new ChordSheetJS.UltimateGuitarParser();
        let song = parser.parse(elSrc.value);
        let formatter = new ChordSheetJS.ChordProFormatter();
        let chordpro = formatter.format(song);
        chordpro = strMeta + chordpro;
        elCPro.value = chordpro;
        elCPro.parentNode.dataset.value = chordpro
        renderCP();
}
elSrc.addEventListener('input', parseUG)

function renderCP() {
        console.log("renderCP")
        let parser = new ChordSheetJS.ChordProParser();
        let song = parser.parse(elCPro.value.replaceAll('\\', '\\\\'));
        let htmlFormatter = new ChordSheetJS.HtmlTableFormatter();
        let html = htmlFormatter.format(song);
        elRndr.innerHTML = html;
}
elCPro.addEventListener('input', renderCP)

elSrc.value = ug;
parseUG();

/*browser.runtime.onMessage.addListener((request) => {
    console.log("Message from the background script:");
    console.log(request.greeting);
    return Promise.resolve({ response: "Hi from content script" });
  });*/

chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
                console.log(request);
                elMeta.innerHTML = ""
                for (key in request) {
                        if (key != "chordSheet") {
                                let elDiv = document.createElement("div")
                                let elChk = document.createElement("input")
                                elChk.type = "checkbox"
                                elChk.addEventListener('change', parseUG)
                                console.log(key)
                                elChk.checked = !key.startsWith("comment: ")
                                let elLab = document.createElement("label")
                                elLab.innerText = key
                                let elVal = document.createElement("input")
                                elVal.type = "text"
                                elVal.value = request[key]
                                elVal.addEventListener('input', parseUG)
                                for (el of [elChk, elLab, elVal])
                                        elDiv.appendChild(el)
                                elMeta.appendChild(elDiv)
                        }
                }
                elSrc.value = request.chordSheet ?? ""
                parseUG();
        }
);