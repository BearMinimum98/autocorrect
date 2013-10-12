//Set up alphabet array
var alphabet = "abcdefghijklmnopqrstuvwxyz";

//Define autoCorrect
var autoCorrectChromeExtension = {
	list : {},
	lastPunc : "",
	lastCorrection : "",
	lastWordTyped : "",
	//Meant to be used in options.html
	replaceAutoCompleteFile : function (json) {
		for (var i = 0; i < 26; i++) {
			localStorage[alphabet[i]] = JSON.stringify(json[alphabet[i]]);
		}
		return "Finished";
	},
	//Meant to be used in options.html
	addAutoCompleteWord : function (word, change) {
		if (localStorage.length == 0) {
			for (var i = 0; i < alphabet.length; i++) {
				localStorage[alphabet[i]] = "{}";
			}
		}
		var firstChar = word.charAt(0).toLowerCase();
		var parsedData = JSON.parse(localStorage[firstChar]);
		parsedData[word.toLowerCase()] = change.toString();
		localStorage[firstChar] = JSON.stringify(parsedData);
		window.onload();
		return "added";
	},
	attachEvent : function (ele) {
		var allOfEle = new Array();
		var tempAllOfEle = document.getElementsByTagName(ele);
		if (ele == "input") {
			for (var i = 0; i < tempAllOfEle.length; i++) {
				if (tempAllOfEle[i].getAttribute("type") == "text") {
					allOfEle.push(tempAllOfEle[i]);
				}
			}
		} else {
			allOfEle = document.getElementsByTagName(ele);
		}
		for (var i = 0; i < allOfEle.length; i++) {
			allOfEle[i].addEventListener("keyup", function (e) {
				var charCode;
				if (e.keyCode == 32 || String.fromCharCode(e.keyCode) == "¼" || String.fromCharCode(e.keyCode) == "¾" /*|| String.fromCharCode(e.keyCode) == ":" || String.fromCharCode(e.keyCode) == ";" || String.fromCharCode(e.keyCode) == ")" || String.fromCharCode(e.keyCode) == "?"*/) {
					if (String.fromCharCode(e.keyCode) == "¼") {
						charCode = ",";
					} else if (e.keyCode == 32) {
						charCode = " ";
					} else if (String.fromCharCode(e.keyCode) == "¾") {
						charCode = ".";
					}
					var words = e.target.value.split(charCode);
					var seleStart = e.target.selectionStart;
					var lengthUntilSelectionStart = 0;
					var lastInput;
					var arrayEleNum;
					for (var i = 0; i < words.length; i++) {
						if (lengthUntilSelectionStart < e.target.selectionStart) {
							lengthUntilSelectionStart += (words[i].length + 1);
						}
						else {
							lastInput = words[i - 1];
							arrayEleNum = i - 1;
							break;
						}
					}
					var firstChar = lastInput.charAt(0);
					if (autoCorrectChromeExtension.list[firstChar.toLowerCase()][lastInput.toLowerCase()]) {
						if (firstChar == firstChar.toLowerCase()) {
							console.log("Reached lowercase case in correction part");
							autoCorrectChromeExtension.lastWordTyped = lastInput;
							autoCorrectChromeExtension.lastCorrection = autoCorrectChromeExtension.list[firstChar][lastInput.toLowerCase()];
							words[arrayEleNum] = autoCorrectChromeExtension.lastCorrection;
							words[arrayEleNum + 1] = e.target.value.split(charCode)[arrayEleNum + 1];
						}
						else {
							console.log("Reached uppercase case in correction part");
							autoCorrectChromeExtension.lastWordTyped = lastInput;
							console.log("First char to uppercase: " + autoCorrectChromeExtension.list[firstChar.toLowerCase()][lastInput.toLowerCase()]);
							autoCorrectChromeExtension.lastCorrection = autoCorrectChromeExtension.list[firstChar.toLowerCase()][lastInput.toLowerCase()];
							//autoCorrectChromeExtension.lastCorrection = autoCorrectChromeExtension.list[firstChar.toLowerCase()][lastInput.toLowerCase()].charAt(0).toUpperCase() + autoCorrectChromeExtension.list[firstChar.toLowerCase()][lastInput.toLowerCase()].substring(1, 1000);
							words[arrayEleNum] = autoCorrectChromeExtension.lastCorrection;
							words[arrayEleNum + 1] = e.target.value.split(charCode)[arrayEleNum + 1];
						}
						e.target.value = words.join(charCode);
						autoCorrectChromeExtension.lastPunc = charCode;
						e.target.selectionStart = seleStart + autoCorrectChromeExtension.list[firstChar.toLowerCase()][lastInput.toLowerCase()].length - autoCorrectChromeExtension.lastWordTyped.length;
						e.target.selectionEnd = e.target.selectionStart;
					}
				}
				else if (e.keyCode == 8) {
					if (autoCorrectChromeExtension.lastCorrection != null) {					
						if (autoCorrectChromeExtension.lastCorrection.length == autoCorrectChromeExtension.lastWordTyped.length) {
							var copyOfTargetValue = e.target.value;
							var seleStart = e.target.selectionStart;
							e.target.value = e.target.value.slice(0, e.target.selectionStart) + (autoCorrectChromeExtension.lastPunc ? autoCorrectChromeExtension.lastPunc : "") + e.target.value.slice(e.target.selectionStart, e.target.value.length - 1);
							e.target.selectionStart = seleStart;
							e.target.selectionEnd = seleStart;
							var splittedText = e.target.value.split(autoCorrectChromeExtension.lastPunc);
							var arrayEleNum;
							var lengthUntilSelectionStart = 0;
							for (var i = 0; i < splittedText.length; i++) {
								if (lengthUntilSelectionStart < e.target.selectionStart) {
									lengthUntilSelectionStart += (splittedText[i].length + 1);
								}
								else {
									lastInput = splittedText[i - 1];
									arrayEleNum = i - 1;
									break;
								}
							}
							if (lastInput == autoCorrectChromeExtension.lastCorrection && autoCorrectChromeExtension.lastCorrection != null) {
								splittedText[arrayEleNum] = autoCorrectChromeExtension.lastWordTyped;
								e.target.value = splittedText.join(autoCorrectChromeExtension.lastPunc);
								if (e.target.value.indexOf(autoCorrectChromeExtension.lastWordTyped + autoCorrectChromeExtension.lastPunc) == (e.target.value.length - (autoCorrectChromeExtension.lastWordTyped + autoCorrectChromeExtension.lastPunc)).length) {
									e.target.value += copyOfTargetValue.charAt(copyOfTargetValue.length - 1);
								}
								e.target.selectionStart = seleStart + autoCorrectChromeExtension.lastWordTyped.length - autoCorrectChromeExtension.lastCorrection.length + 1;
								e.target.selectionEnd = e.target.selectionStart;
							} else {
								e.target.value = copyOfTargetValue;
							}
							delete autoCorrectChromeExtension.lastCorrection;
							return;
						} else {
							var interestedPart = e.target.value.substring(e.target.selectionStart - autoCorrectChromeExtension.lastCorrection + 1, e.target.selectionStart);
							var interestedPart = autoCorrectChromeExtension.lastWordTyped;
							e.target.value = e.target.value.substring(0, e.target.selectionStart - autoCorrectChromeExtension.lastCorrection.length) + interestedPart + autoCorrectChromeExtension.lastPunc + e.target.value.substring(e.target.selectionStart + autoCorrectChromeExtension.lastWordTyped.length, e.target.value.length);
							delete autoCorrectChromeExtension.lastCorrection;
							return;
						}
					}
				}
			}, false);
		}
	},
	//This function meant to be used in options.html
	showAllCorrections : function () {
		var outputArray = new Array();
		for (var i = 0; i < alphabet.length; i++) {
			for (var k = 0; k < localStorage[alphabet[i].length]; k++) {
				outputArray[alphabet[i]][k] = JSON.parse(localStorage[alphabet[i]])[k];
			}
		}
		return outputArray;
	},
	//This function meant to be used in options.html
	addList : function (url) {
		document.querySelector('#status').innerHTML = "Processing... This may take a couple minutes depending on file size";
		setTimeout(function() {try {var listSource = getList(url);for (var i = 0; i < listSource.length; i++) {var parsed = listSource[i].split(":");autoCorrectChromeExtension.addAutoCompleteWord(parsed[0], parsed[1]);}document.querySelector('#status').innerHTML = "Add complete!";} catch (e) {throw new Error(e);}}, 0);
	},
	init : function () {
		try {
			chrome.extension.sendRequest("list", function (response) {
				autoCorrectChromeExtension.list = response;
			});
			autoCorrectChromeExtension.attachEvent("textarea");
			autoCorrectChromeExtension.attachEvent("input");
		} catch (e) {
			alert("Something went wrong: " + e.message);
		}
	}
};

function getList(url) {
	var request = new XMLHttpRequest();
	request.open("GET", url, false);
	request.onerror = function () {
		alert("Error: Did you forget http:// or www.?");
	};
	request.send(null);
	try {
		return request.response.split("~");
	}
	catch(e) {
		throw new Error("Could not get server response or server response in bad format.");
	}
};
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request == "reinit") {
		autoCorrectChromeExtension.init();
		console.log("reinited");
	}
});
autoCorrectChromeExtension.init();