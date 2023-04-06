let statusScrap = "stop";

const saveObjectInLocalStorage = async function (key) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set(key, function () {
        resolve();
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

const getObjectInLocalStorage = async function (key) {
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

/* chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async function ({ message }) {
    if (message === "startscrap") {
      const status = "start";
      await saveObjectInLocalStorage(status);
    }

    if (message === "finish") {
      // const status = await getObjectInLocalStorage("status");
      // if (status === "start") 
        port.postMessage({ message: "nextpage" });
    }
  });
});
 */

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async function ({ message }, {sender}) {
    if (message === "start") {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if(!tab) return;
      statusScrap = "start"

      let port = chrome.tabs.connect(tab.id, { name: "background-content" });
      port.postMessage({ message: "scrap"});
      return;
    }

    if (message === "next") {
      console.log("tabid: ", sender.tab.id);
      console.log("url: ", sender.tab.url);

      await chrome.tabs.update(sender.tab.id, {url: "https://www.occ.com.mx/empleos/en-ciudad-de-mexico/en-la-ciudad-de-alvaro-obregon/?page=1"})
      // sendResponse({ message: "scrap"});
      return;
      
    }

    if (message === "online" && statusScrap === "start") {
      port.postMessage({ message: "scrap"});
      return;
    }
  });
});
