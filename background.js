const saveObjectInLocalStorage = async function (key, value) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set(
        { [key]: JSON.stringify(value, null, 2) },
        function () {
          resolve();
        }
      );
    } catch (ex) {
      reject(ex);
    }
  });
};

const getObjectInLocalStorage = async function (key) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(key, function (value) {
        const data = value[key] ? JSON.parse(value[key]) : [];
        resolve({ [key]: data });
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async function ({ message, data }) {
    if (message === "saveandnext") {
      const savedData = await getObjectInLocalStorage("jobs");

      await saveObjectInLocalStorage("jobs", [...data, ...savedData.jobs]);

      port.postMessage({ message: "nextpage" });
    }
    if (message === "morejobs") {
      setTimeout(() => {
        port.postMessage({ message: "scrap" });
      }, 3000);
    }
    if (message === "nomorepages") {
      const data = await getObjectInLocalStorage("jobs");
      port.postMessage({ message: "finish", data });
    }
  });
});
