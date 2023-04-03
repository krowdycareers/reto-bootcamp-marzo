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
	if (message === "nextpage") {
		const nextPageButton = document.querySelector("[class*=next-]");
		nextPageButton.click();
	}
});

chrome.runtime.onConnect.addListener(function (port) {
	port.onMessage.addListener(function ({ message }) {
		if (message === "getJobs") {
			const jobs = getJobInformation();
			port.postMessage({
				message: "ok",
				data: jobs
			});
			portBackground.postMessage({ message: "finish" });
		}
	});
});
