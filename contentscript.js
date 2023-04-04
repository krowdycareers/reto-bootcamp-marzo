console.log("Ejecutando el content script 2.0");

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

// Connect to background
const portBackground = chrome.runtime.connect({ name: "content-background" });

portBackground.onMessage.addListener(async ({ message }) => {
	switch(message) {
		case "scrap": {
			const scrapedJobs = getJobInformation();
			portBackground.postMessage({
				message: "storeScrapedJobs",
				data: { scrapedJobs }
			});
			break;
		}
		case "nextpage": {
			const nextPageButton = document.querySelector("[class*=next-]");
			nextPageButton.click();
			break;
		}
		default:
	}
});

chrome.runtime.onConnect.addListener(function (port) {
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
