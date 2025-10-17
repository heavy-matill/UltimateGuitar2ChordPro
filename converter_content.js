let elMeta
let elSrc

function triggerParseUG() {
    elSrc.dispatchEvent(new Event('input'))
}

function addMetaField(elParent, key, value) {
    const isComment = (key.startsWith("comment: ") || key.startsWith("c: "))
    let elRow = document.createElement("tr")
    let elChkT = document.createElement("th")
    let elChk = document.createElement("input")
    elChk.type = "checkbox"
    elChk.checked = !isComment
    elChk.addEventListener('change', triggerParseUG)
    elChkT.appendChild(elChk)

    let elChkT2 = document.createElement("th")
    let elChk2 = document.createElement("input")
    elChk2.type = "checkbox"
    elChk2.checked = false
    if (isComment)
        elChk2.setAttribute("disabled", true)
    elChk2.addEventListener('change', triggerParseUG)
    elChkT2.appendChild(elChk2)

    let elLabT = document.createElement("th")
    elLabT.innerText = key
    let elValT = document.createElement("tr")
    let elVal = document.createElement("input")
    elVal.type = "text"
    elVal.value = value
    elVal.style = "width: 100%;"
    elValT.appendChild(elVal)
    elVal.addEventListener('input', triggerParseUG)
    for (el of [elChkT, elChkT2, elLabT, elValT])
        elRow.appendChild(el)
    elParent.appendChild(elRow)
}

var requestQueue = []

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log({request});
        requestQueue.push(request);
    }
)
window.addEventListener('load', main)
function main(e) {
    elMeta = document.getElementById("meta")
    elSrc = document.getElementById('source')

    console.log("loaded")
    setInterval(() => {
        if (requestQueue.length) {
            processRequest(requestQueue.slice(-1)[0])
            requestQueue = []
        }
    }, 300)
}

function processRequest(request) {
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
    triggerParseUG();
}