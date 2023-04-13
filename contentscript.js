const portBackground = chrome.runtime.connect({ name: 'content-background' });

const wait = (ms) => {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
};

const getJobInformation = () => {
	const elementCardJobs = [...document.querySelectorAll('[id*="jobcard-"]')];
	const jobs = elementCardJobs.map((cardJob) => {
		const [
			{ href: url },
			{
				children: [
					{
						children: [
							{ },
							{ innerText: title },
							{ innerText: salary },
							{ innerText: beneficios },
							{
								children: [elemtEmpresaCiudad],
							},
						],
					},
				],
			},
		] = cardJob.children;

		const empresa = elemtEmpresaCiudad?.querySelector('label')?.innerText;
		const city = elemtEmpresaCiudad?.querySelector("[class *= 'link-0-2']")?.innerText;

		return { url, title, salary, beneficios, empresa, city };
	});

	return jobs;
};

const sendJobData = () => {
	const jobs = getJobInformation();
	const nextPageButton = document.querySelector('[class *= next-]');
	const message = !!nextPageButton ? 'next' : '';
	portBackground.postMessage({ message, data: jobs });
};

const handleScrapMessage = async () => {
	await wait(3000);
	sendJobData();
};

portBackground.postMessage({ message: 'online' });
portBackground.onMessage.addListener(({ message }) => {
	if (message === 'scrap') {
		handleScrapMessage();
	}
});

chrome.runtime.onConnect.addListener((port) => {
	port.onMessage.addListener(({ message }) => {
		if (message === 'scrap') {
			sendJobData();
		}
	});
});
