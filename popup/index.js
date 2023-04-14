async function main() {
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

				while (results.firstChild) {
					results.removeChild(results.lastChild);
				}

				const tbl = document.createElement("table");
				const tblBody = document.createElement("tbody");

				const [firstJob] = jobs;

				if(!firstJob) {
					return;
				}

				const row = document.createElement("tr");

				Object.keys(firstJob).forEach((field) => {
					const cell = document.createElement("th");
					const cellText = document.createTextNode(field);

					cell.appendChild(cellText);
					row.appendChild(cell);

				});

				tblBody.appendChild(row);

				jobs.forEach((job) => {
					const row = document.createElement("tr");

					Object.values(job).forEach((value) => {
						const cell = document.createElement("td");
						const cellText = document.createTextNode(value);

						cell.appendChild(cellText);
						row.appendChild(cell);
					});

					tblBody.appendChild(row);
				});

				tbl.appendChild(tblBody);
				document.body.appendChild(tbl);

				results.appendChild(tbl);
				break;
			}
			default:
		}
	});

	const [tab] = await chrome.tabs.query({
		active: true,
		currentWindow: true
	});
	const portContentScript = chrome.tabs.connect(tab.id, { name: "popup" });
	portContentScript.onMessage.addListener(({ message }) => {
		switch (message) {
			case "refreshJobsTable": {
				portBackground.postMessage({ message: "getAllJobs" });
				break;
			}
			default:
		}
	});

	btnScripting.addEventListener("click", async () => {
		portContentScript.postMessage({ message: "scrapJobs" });

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
}

main();
