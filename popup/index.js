const btnScripting = document.getElementById("btncomunicacion");
const btnGetScrapingStatus = document.getElementById("btngetscrapingstatus");
const btnGetAllJobs = document.getElementById("btngetalljobs");
const btnShutdown = document.getElementById("btnshutdown");
const results = document.getElementById("results");


btnScripting.addEventListener("click", async () => {
	const [tab] = await chrome.tabs.query({
		active: true,
		currentWindow: true
	});
	const portContentScript = chrome.tabs.connect(tab.id, { name: "popup" });
	portContentScript.postMessage({ message: "scrapJobs" });
	portContentScript.onMessage.addListener(({ message, data }) => {
		switch (message) {
			case "ok": {
				results.textContent = JSON.stringify(data, null, 2);
				break;
			}
			default:
		}
	});
});


const portBackground = chrome.runtime.connect({ name: "popup-background" });
portBackground.onMessage.addListener(function ({ message, data }) {
	switch (message) {
		case "sentScrapingStatus": {
			const { status } = data;
			console.log({ status });
			break;
		}
		case "sentAllJobs": {
			const { jobs } = data;
			console.log(jobs);
			break;
		}
		default:
	}
});

btnGetScrapingStatus.addEventListener("click", () => {
	portBackground.postMessage({ message: "getScrapingStatus" });
});

btnGetAllJobs.addEventListener("click", () => {
	portBackground.postMessage({ message: "getAllJobs" });
});

btnShutdown.addEventListener("click", () => {
	portBackground.postMessage({ message: "shutdown" });
});