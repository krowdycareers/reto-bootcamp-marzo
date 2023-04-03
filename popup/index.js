const btnScripting = document.getElementById("btncomunicacion");
const btnScriptingBackground = document.getElementById("btncomunicacionbckg");
const results = document.getElementById("results");

btnScripting.addEventListener("click", async () => {
	const [tab] = await chrome.tabs.query({
		active: true,
		currentWindow: true
	});
	let port = chrome.tabs.connect(tab.id, { name: "popup" });
	port.postMessage({ message: "getJobs" });
	port.onMessage.addListener(({ message, data }) => {
		switch (message) {
			case "ok": {
				results.textContent = JSON.stringify(data, null, 2);
				break;
			}
			default:
		}
	});
});

let port = chrome.runtime.connect({ name: "popup-background" });
port.postMessage({ message: "hello" });
port.postMessage({ message: "getScrapingStatus" });
port.onMessage.addListener(function ({ message, data }) {
	switch (message) {
		case "sentHello": {
			const { message } = data;
			alert(message);
			break;
		}
		case "sentScrapingStatus": {
			const { status } = data;
			console.log({ status });
			break;
		}
		default:
	}
});
