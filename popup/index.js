const btnScripting = document.getElementById("btncomunicacion");
const btnGetScrapingStatus = document.getElementById("btngetscrapingstatus");
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


const port = chrome.runtime.connect({ name: "popup-background" });
port.onMessage.addListener(function ({ message, data }) {
	switch (message) {
		case "sentScrapingStatus": {
			const { status } = data;
			console.log({ status });
			break;
		}
		default:
	}
});

btnGetScrapingStatus.addEventListener("click", () => {
	port.postMessage({ message: "getScrapingStatus" });
});