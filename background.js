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
	port.onMessage.addListener(async function ({ message }) {
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
				const status = "start";
				await saveObjectInLocalStorage(status);
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
