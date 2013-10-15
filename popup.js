window.onload = function() {
	document.getElementById("init").addEventListener("click", function() {
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendMessage(tab.id, "reinit", null);
		});
	}, false);
	document.getElementById("add").addEventListener("click", function() {
		document.getElementById("status").innerHTML = autoCorrectChromeExtension.addAutoCompleteWord(document.getElementById("incorrect").value, document.getElementById("correct").value);
	}, false);
	document.getElementById("openOptions").addEventListener("click", function() {
		location = "options.html";
	}, false);
};
