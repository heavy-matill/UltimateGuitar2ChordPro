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