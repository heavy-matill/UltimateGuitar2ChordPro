/*let scriptEle = document.createElement("script");
scriptEle.setAttribute("src", "https://github.com/martijnversluis/ChordSheetJS/releases/download/v8.5.0/bundle.js");
document.body.appendChild(scriptEle);

scriptEle.addEventListener("load", () => {
	console.log("File loaded")
	convertSong();

});

scriptEle.addEventListener("error", (ev) => {
	console.log("Error on loading file", ev);
});*/

const html = `
<dialog>
  <button autofocus>Close</button>
  <p>This modal dialog has a groovy backdrop!</p>
</dialog>
<button>Show the dialog</button>
`

const isOfficial = /-official-[0-9]+$/.test(document.URL)
let dictMeta = {}
let chordSheet = ""
if (isOfficial) {
	// switch to Chords view
	setTimeout(
		() => Array.from(document.querySelectorAll("div[role='button']"))
			.filter(el => el.innerText == "CHORDS")[0].click(),
		2000)
}
setTimeout(addButton, 2000);

function showPopover() {

	document.body.insertAdjacentHTML("beforeend", html);
}

function addButton() {
	const divAddToPlaylist = Array.from(document.getElementsByTagName("button")).filter(e => ["ADDED TO FAVORITES", "ADD TO FAVORITES"].includes(e.innerText.toUpperCase()))[0].parentNode
	const divConvert = divAddToPlaylist.parentNode.insertBefore(divAddToPlaylist.cloneNode(true), divAddToPlaylist.parentNode.children[0])
	// change text
	divConvert.getElementsByTagName('span')[0].innerHTML = 'ChordPro'
	// change icon to mdi icon, svn download, copy path, scale with this tool https://yqnn.github.io/svg-path-editor/
	divConvert.getElementsByTagName('path')[0].setAttribute('d', "M 5.3333 2.2222 H 3.1111 V 4.4444 H 1.7778 V 0.8889 h 3.5556 V 2.2222 z M 14.6667 4.4444 l 0 -2.2222 l -2.2222 0 L 12.4444 0.8889 l 3.5556 0 l 0 3.5556 L 14.6667 4.4444 z M 12.4444 15.5555 h 2.2222 V 13.3333 H 16 v 3.5556 h -3.5556 V 15.5555 z M 3.1111 13.3333 l 0 2.2222 l 2.2222 0 L 5.3333 16.8889 l -3.5556 0 l 0 -3.5556 L 3.1111 13.3333 z M 12.0622 3.5556 H 5.7155 C 5.0133 3.5556 4.4444 4.1511 4.4444 4.8889 v 8 C 4.4444 13.6267 5.0133 14.2222 5.7155 14.2222 h 6.3467 c 0.7022 0 1.2711 -0.5956 1.2711 -1.3333 v -8 C 13.3333 4.1511 12.7644 3.5556 12.0622 3.5556 z M 10.6667 11.5555 H 7.1111 v -1.3333 h 3.5556 V 11.5555 z M 10.6667 9.5555 H 7.1111 v -1.3333 h 3.5556 V 9.5555 z M 10.6667 7.5555 H 7.1111 V 6.2222 h 3.5556 V 7.5555 z");
	divConvert.getElementsByTagName('button')[0].addEventListener('click', convertSong);
}
function parseTempoFromStrumming(el) {
	let uniqueTempos = Array.from(new Set(Array.from(el.innerText.matchAll(/([0-9.]*)(?:\sbpm)/g)).map(m => m[1])))
	if (uniqueTempos.length)
		dictMeta['tempo'] = uniqueTempos.join(", ")
}

function convertSong() {

	let chordsEle
	if (isOfficial) {
		parseTempoFromStrumming(Array.from(document.getElementsByTagName("section")).filter(el => el.innerText.startsWith("STRUMMING"))[0])
		chordsEle = document.getElementsByTagName("pre")[0]
	} else {
		chordsEle = document.getElementsByTagName('aside')[0].nextSibling
		if (chordsEle.innerText.startsWith('CHORDS'))
			chordsEle = chordsEle.nextSibling;
		if (chordsEle.innerText.startsWith('STRUMMING')) {
			// get tempos if any available
			parseTempoFromStrumming(chordsEle)
			chordsEle = chordsEle.nextSibling;
		}

	}
	let chordSheet = chordsEle.innerText.slice(0, -1).replaceAll('\n\n', '\n');

	// get metadata
	const titleEle = document.getElementsByTagName('h1')[0]
	dictMeta['title'] = titleEle.innerText.split(' ').slice(0, -1).join(' ')
	const artistEle = titleEle.nextElementSibling
	dictMeta['artist'] = Array.from(artistEle.getElementsByTagName("a")).map(el => el.innerText)

	// get more metadata
	const tableEle = document.getElementsByTagName('table')[0]
	for (tr of tableEle.children) {
		dictMeta[tr.children[0].innerText.slice(0, -1)] = tr.children[1].innerText
	}

	if (!isOfficial) {
		// Author and creation data
		const authorEle = tableEle.parentElement.nextSibling
		const strAuthor = authorEle.innerText.split('ast edit on ')
		console.log({ strAuthor })
		dictMeta['Author'] = strAuthor[0].replace(/^Author\s*/, '').replace(/\..*$/g, '')
		if (strAuthor[1].endsWith('ago')) {
			let matches = strAuthor[1].match(/([0-9]*)\s([a-z]*)\s/);
			let numTime = Number(matches[1])
			let date = new Date()
			if (matches[2].startsWith('minute'))
				date.setMinutes(date.getMinutes() - numTime)
			else if (matches[2].startsWith('hour'))
				date.setHours(date.getHours() - numTime)
			else if (matches[2].startsWith('day'))
				date.setHours(date.getHours() - numTime * 24)
			dictMeta['Last edit on'] = new Date(date).toISOString().split('T')[0]
		} else {
			dictMeta['Last edit on'] = new Date(strAuthor[1]).toISOString().split('T')[0]
		}
	}

	const keysChordPro = ["title", "sorttitle", "subtitle", "artist", "composer", "lyricist", "copyright", "album", "year", "key", "time", "tempo", "duration", "capo", "meta"]
	let dictMetaOut = {}
	for (key in dictMeta) {
		if (keysChordPro.includes(key.toLowerCase()))
			dictMetaOut[key.toLowerCase()] = dictMeta[key];
		else
			dictMetaOut["c: " + key] = dictMeta[key];
	}

	chrome.runtime.sendMessage({ chordSheet: chordSheet, ...dictMetaOut }, function (response) {
		//console.log(response);
	});
	/*const parser = new ChordSheetJS.UltimateGuitarParser();
	const song = parser.parse(chordSheet);

	// set Metadata
	//song.setMetadata('artist','Bruno')

	const formatter = new ChordSheetJS.ChordProFormatter();
	const disp = formatter.format(song);
	console.log(disp)

	const htmlFormatter = new ChordSheetJS.HtmlTableFormatter();
	const htmlDisp = htmlFormatter.format(song);
	console.log(htmlDisp)*/
}