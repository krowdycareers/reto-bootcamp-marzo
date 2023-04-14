const btnScripting = document.getElementById("btncomunicacion");
const btnGetScrapingStatus = document.getElementById("btngetscrapingstatus");
const btnGetAllJobs = document.getElementById("btngetalljobs");
const btnShutdown = document.getElementById("btnshutdown");
const results = document.getElementById("results");

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
			results.textContent = JSON.stringify(jobs, null, 2);
			break;
		}
		default:
	}
});

btnScripting.addEventListener("click", async () => {
	const [tab] = await chrome.tabs.query({
		active: true,
		currentWindow: true
	});
	const portContentScript = chrome.tabs.connect(tab.id, { name: "popup" });
	portContentScript.postMessage({ message: "scrapJobs" });
	portContentScript.onMessage.addListener(({ message }) => {
		switch (message) {
			case "refreshJobsTable": {
				portBackground.postMessage({ message: "getAllJobs" });
				break;
			}
			default:
		}
	});
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
