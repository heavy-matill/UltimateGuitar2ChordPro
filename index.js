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
        let title = ""
        for (el of elMeta.children) {
                let key = el.children[1].innerText
                let val = el.children[2].value
                if (el.children[0]?.checked) {
                        strMeta = strMeta + `{${key}: ${val}}\n`
                        if (key != "title" && !key.startsWith("c") && !key.startsWith("comment")) {
                                if (key == "artist") {
                                        // write artist as subtitle
                                        strMeta = strMeta + `{subtitle: ${val}}\n`
                                } else {
                                        // write as comment so its visible
                                        strMeta = strMeta + `{c: ${key}: ${val}}\n`
                                }
                        }
                        if (key == "title")
                                title = val
                }
                if (!key.includes(" ")) {
                        // write as additional meta tag
                        strMeta = strMeta + `{meta: ${key} ${val}}\n`
                }
        }
        let parser = new ChordSheetJS.UltimateGuitarParser();
        let songSrc = elSrc.value
        // preprocess
        // remove first line if its the title
        if (title.length)
                songSrc.replace(new RegExp(`^[^\n]*(${title})[^\n]*$\n`, 'gm'), "");
        let song = parser.parse(elSrc.value);
        let formatter = new ChordSheetJS.ChordProFormatter();
        let chordpro = formatter.format(song);
        chordpro = strMeta + chordpro;
        elCPro.value = chordpro;
        // for full size styled textarea
        elSrc.parentNode.dataset.value = elSrc.value
        elCPro.parentNode.dataset.value = chordpro
        renderCP();
}
elSrc.addEventListener('input', parseUG)

function renderCP() {
        console.log("renderCP")
        let parser = new ChordSheetJS.ChordProParser();
        let strCP = elCPro.value.replaceAll('\\', '\\\\')
        let song = parser.parse(strCP);
        let htmlFormatter = new ChordSheetJS.HtmlTableFormatter();
        let html = htmlFormatter.format(song);
        // render meta table
        let elDivMeta = document.getElementById("renderMeta")
        elDivMeta.innerHTML = ""
        let elHMeta = document.createElement("h5")
        elHMeta.innerHTML = "Metadata"
        elDivMeta.appendChild(elHMeta)
        for (match of Array.from(strCP.matchAll(/^{meta:\s*([^\s]*)\s*([^}]*)/gm))) {
                console.log({ match })
                let elDivRow = document.createElement("div")
                let elKey = document.createElement("label")
                elKey.classList = "col-3"
                elKey.innerHTML = match[1]
                let elVal = document.createElement("label")
                elVal.classList = "col-9"
                elVal.innerHTML = match[2]
                elDivRow.appendChild(elKey)
                elDivRow.appendChild(elVal)
                elDivMeta.appendChild(elDivRow)
        }
        elDivMeta.innerHTML = elDivMeta.outerHTML
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
function addMetaField(elParent, key, value) {
        let elDiv = document.createElement("div")
        elDiv.classList = "row"
        let elChk = document.createElement("input")
        elChk.type = "checkbox"
        elChk.classList = "col-1"
        elChk.addEventListener('change', parseUG)
        console.log(key)
        elChk.checked = !(key.startsWith("comment: ") || key.startsWith("c: "))
        let elLab = document.createElement("label")
        elLab.innerText = key
        elLab.classList = "col-3"
        let elVal = document.createElement("input")
        elVal.type = "text"
        elVal.value = value
        elVal.classList = "col-8"
        elVal.addEventListener('input', parseUG)
        for (el of [elChk, elLab, elVal])
                elDiv.appendChild(el)
        elParent.appendChild(elDiv)
}

chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
                console.log(request);
                elMeta.innerHTML = ""
                for (key in request) {
                        if (key != "chordSheet") {
                                let value = request[key]
                                if (typeof value === "string") {
                                        addMetaField(elMeta, key, value)
                                } else {
                                        for (val of value)
                                                addMetaField(elMeta, key, val)
                                }
                        }
                }
                elSrc.value = request.chordSheet ?? ""
                parseUG();
        }
);