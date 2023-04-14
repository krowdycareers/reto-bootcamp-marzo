console.log("Ejecutando el content script 2.5");
let portEmergent = null;

function getJobInformation() {
	const elemCardJobs = [...document.querySelectorAll("[id*='jobcard-']")];
	const jobs = elemCardJobs.map((cardJob) => {
		const [
			{ href: url },
			{
				children: [
					{
						children: [
							{ innerText: fecha },
							{ innerText: title },
							{ innerText: salario },
							{ innerText: beneficios },
							,
							{
								children: [elementEmpresCiudad]
							}
						]
					}
				]
			}
		] = cardJob.children;

		const empresa = elementEmpresCiudad?.querySelector("label")?.innerText;
		const ciudad = elementEmpresCiudad?.querySelector("p")?.innerText;
		return {
			url,
			fecha,
			title,
			salario,
			beneficios,
			empresa,
			ciudad
		};
	});

	return jobs;
}

const isElementLoaded = async (selector) => {
	while(document.querySelector(selector) === null) {
		await new Promise((resolve) => requestAnimationFrame(resolve));
	}
	return document.querySelector(selector);
};

// Connect to background
const portBackground = chrome.runtime.connect({ name: "content-background" });

let isPopupOpen = true;

async function scrap() {
	await isElementLoaded("[id*='jobcard-']");
	const scrapedJobs = getJobInformation();

	const [{ fecha }] = scrapedJobs;

	if(fecha.replace("\nRecomendada", "").trim() !== "Hoy") {
		return;
	}

	portBackground.postMessage({
		message: "storeScrapedJobs",
		data: { scrapedJobs }
	});

	portBackground.postMessage({
		message: "getIsPopupOpen"
	});

	isPopupOpen && portEmergent.postMessage({
		message: "refreshJobsTable"
	});
}

portBackground.onMessage.addListener(async ({ message, data }) => {
	switch(message) {
		case "scrap": {
			await scrap();
			break;
		}
		case "finishPartialScrap": {
			await isElementLoaded("[class*=next-]");
			const nextPageButton = document.querySelector("[class*=next-]");
			nextPageButton.click();
			await scrap();
			break;
		}
		case "sentIsPopupOpen": {
			isPopupOpen = data.isPopupOpen;
			break;
		}
		default:
	}
});

chrome.runtime.onConnect.addListener(function (port) {
	portEmergent = port;

	port.onMessage.addListener(function ({ message }) {
		switch(message) {
			case "scrapJobs": {
				portBackground.postMessage({ message: "startscrap" });
				const jobs = getJobInformation();
				port.postMessage({
					message: "ok",
					data: jobs
				});
				break;
			}
			default:
		}
	});
});
