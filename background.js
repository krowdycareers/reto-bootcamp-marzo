let statusScrap = 'stop';
let jobsAcumulado = [];

const saveObjectInLocalStorage = async (obj) => {
	return new Promise((resolve, reject) => {
		try {
			chrome.storage.local.set(obj, () => {
				resolve();
			});
		} catch (ex) {
			reject(ex);
		}
	});
};

const getObjectInLocalStorage = async (key) => {
	return new Promise((resolve, reject) => {
		try {
			chrome.storage.local.get(key, (value) => {
				resolve(value);
			});
		} catch (ex) {
			reject(ex);
		}
	});
};

const addPageToURL = (url) => {
	const regex = /page=(\d+)/;
	const match = url.match(regex);
	const page = match && match[1];
	const newPage = parseInt(page) + 1;
	return url.replace(regex, `page=${newPage}`);
};

const scrapPage = async (tabId, tabUrl) => {
	const jobs = await chrome.tabs.executeScript(tabId, {
		code: `(${getJobInformation})()`,
	});
	jobsAcumulado = [...jobsAcumulado, ...jobs];

	const nextPageButton = await chrome.tabs.executeScript(tabId, {
		code: `document.querySelector('[class*=next-]') !== null`,
	});

	if (nextPageButton) {
		const nextUrl = addPageToURL(tabUrl);
		await chrome.tabs.update(tabId, { url: nextUrl });
	} else {
		statusScrap = 'finish';
		const jobsData = { message: 'finish', data: jobsAcumulado };
		jobsAcumulado = [];
		port.postMessage(jobsData);
	}
};

chrome.runtime.onConnect.addListener((port) => {
	port.onMessage.addListener(async ({ message, data }, sender, sendResponse) => {
		if (message === 'start') {
			const [tab] = await chrome.tabs.query({
				active: true,
				currentWindow: true,
			});

			if (!tab) {
				const errorData = { message: 'error' };
				port.postMessage(errorData);
				return;
			}

			statusScrap = 'start';
			const portConent = chrome.tabs.connect(tab.id, { name: 'background-content' });
			portConent.postMessage({ message: 'scrap' });
		} else if (message === 'next') {
			scrapPage(sender.sender.tab.id, sender.sender.tab.url);
		} else if (message === 'online' && statusScrap === 'start') {
			const jobsData = { message: 'scrap' };
			port.postMessage(jobsData);
		}
	});
});

const getJobInformation = () => {
	const elementCardJobs = [...document.querySelectorAll('[id*="jobcard-"]')];
	const jobs = elementCardJobs.map((cardJob) => {
		const [
			{ href: url },
			{
				children: [
					{ children: [{ }] },
					{ innerText: title },
					{ innerText: salary },
					{ innerText: beneficios },
					{ children: [elemtEmpresaCiudad] },
				],
			},
		] = cardJob.children;

		const empresa = elemtEmpresaCiudad?.querySelector('label')?.innerText;
		const city = elemtEmpresaCiudad?.querySelector("[class *= 'link-0-2']")?.innerText;

		return { url, title, salary, beneficios, empresa, city };
	});

	return jobs;
};
