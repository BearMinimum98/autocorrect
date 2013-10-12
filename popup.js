window.onload = function() {
	document.getElementById("init").addEventListener("click", function() {
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendMessage(tab.id, "reinit", null);
		});
	}, false);
}