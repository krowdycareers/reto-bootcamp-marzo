const saveObjectInLocalStorage = async function (obj) {
	return new Promise((resolve, reject) => {
		try {
			chrome.storage.local.set(obj, function () {
				resolve();
			});
		} catch (ex) {
			reject(ex);
		}
	});
};

const getObjectFromLocalStorage = async function (key) {
	return new Promise((resolve, reject) => {
		try {
			chrome.storage.local.get([key], function (value) {
				resolve(value[key]);
			});
		} catch (ex) {
			reject(ex);
		}
	});
};

chrome.runtime.onConnect.addListener(function (port) {
	port.onMessage.addListener(async function ({ message, data }) {
		switch (message) {
			case "getScrapingStatus": {
				const status = await getObjectFromLocalStorage("status");
				port.postMessage({
					message: "sentScrapingStatus",
					data: { status }
				});
				break;
			}
			case "startscrap": {
				const status = {status: "start"};
				await saveObjectInLocalStorage(status);
				port.postMessage({ message: "scrap" });
				break;
			}
			case "storeScrapedJobs": {
				const { scrapedJobs } = data;
				const jobs = await getObjectFromLocalStorage("jobs") || [];
				const jobsToStore = [...jobs, ...scrapedJobs];
				await saveObjectInLocalStorage({ jobs: jobsToStore });

				port.postMessage({
					message: "finishPartialScrap"
				});
				break;
			}
			case "getAllJobs": {
				const jobs = await getObjectFromLocalStorage("jobs") || [];
				port.postMessage({
					message: "sentAllJobs",
					data: { jobs }
				});
				break;
			}
			case "shutdown": {
				await saveObjectInLocalStorage({ status: null });
				await saveObjectInLocalStorage({ jobs: [] });
				break;
			}
			case "finish": {
				port.postMessage({ message: "nextpage" });
				break;
			}
			default:
		}
	});
});
