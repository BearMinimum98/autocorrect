var firstLoad = true;
window.onload = function() {
	if (firstLoad) {
		document.getElementById("addButton").addEventListener("click", function() {
			document.querySelector('#status').innerHTML = autoCorrectChromeExtension.addAutoCompleteWord(document.querySelector('#searchText').value.toLowerCase(), document.querySelector('#replaceText').value);
		}, false);
		document.getElementById("removeButton").addEventListener("click", function() {
			document.querySelector('#status').innerHTML = onRemove();
		}, false);
		document.getElementById("removeAllButton").addEventListener("click", function() {
			document.querySelector('#status').innerHTML = removeAllOptions();
		}, false);
		document.getElementById("subscribe").addEventListener("click", function() {
			autoCorrectChromeExtension.addList(document.querySelector('#subscription').value);
			window.onload();
		}, false);
		document.getElementById("defaults-button").addEventListener("click", function() {
			chrome.extension.sendRequest("list", function (response) {
				document.querySelector('#status').innerHTML = autoCorrectChromeExtension.replaceAutoCompleteFile(response);
				window.onload();
			});
		}, false);
		document.getElementById("findTypoButton").addEventListener("click", function() {
			document.querySelector('#status').innerHTML = findWord(document.getElementById("findText").value, "typo");
		}, false);
		document.getElementById("findCorrectionButton").addEventListener("click", function() {
			document.querySelector('#status').innerHTML = findWord(document.getElementById("findText").value, "correction");
		}, false);
		document.getElementById("exportList").addEventListener("click", function() {
			alert(exportList());
		}, false);
	}
	firstLoad = false;
	document.querySelector("#wordList").options.length = 0;
	var allCorrections = autoCorrectChromeExtension.showAllCorrections;
	try {
		for (var i = 0; i < alphabet.length; i++) {
			var theBigArray = localStorage[alphabet[i]].substring(1, localStorage[alphabet[i]].length-2).split('"').join("").split(",");
			theBigArray.sort();
			for (var k = 0; k < theBigArray.length; k++) {
				if (theBigArray[k] != "{") {
					document.querySelector("#wordList").options[document.querySelector("#wordList").options.length] = new Option(theBigArray[k], theBigArray[k].split(":")[0], false, false);
				}
			}
		}
	}
	catch(e) {
		console.log("Non-fatal error: " + e.message);
	}
}
function onRemove() {
	try {
		var toRemove = document.querySelector("#wordList").options[document.querySelector("#wordList").selectedIndex].value;
		var firstChar = toRemove.charAt(0);
		var parsedData = JSON.parse(localStorage[firstChar.toLowerCase()]);
		delete parsedData[toRemove];
		localStorage[firstChar] = JSON.stringify(parsedData);
		window.onload();
		return "Removed auto-correcting of " + toRemove;
	}
	catch(e) {
		console.log("Non-fatal error: " + e.message);
		return "Non-fatal error, see console for details";
	}
}
function removeAllOptions() {
	localStorage.clear();
	window.onload();
	return "All corrections removed";
}

function findWord(word, mode) {
	if (mode.toLowerCase() == "typo") {
		for (var i = 0; i < document.getElementById("wordList").length; i++) {
			if (document.getElementById("wordList")[i].innerHTML.split(":")[0] == word) {
				document.getElementById("wordList").selectedIndex = i;
				return "Found match";
			}
		}
		return "No match found";
	} else if (mode.toLowerCase() == "correction") {
		for (var i = 0; i < document.getElementById("wordList").length; i++) {
			if (document.getElementById("wordList")[i].innerHTML.split(":")[1] == word) {
				document.getElementById("wordList").selectedIndex = i;
				return "Found match";
			}
		}
		return "No match found";
	} else {
		throw new Error("Unknown mode");
	}
}

function exportList() {
	var list = "";
	for (var i = 0; i < document.getElementById("wordList").length; i++) {
		list += document.getElementById("wordList")[i].innerHTML;
		list += "~";
	}
	return list;
}