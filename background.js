let statusScrap = "stop";
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

const gatObjectInLocalStorage = async function (obj) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(key, function (value) {
        resolve(value);
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

function addNewPagetoURL(url) {
  const regex = /page=(\d+)/;
  const match = url.match(regex);
  const page = match && match[1];
  const nextPage = parseInt(page)+1;
  return url.replace(regex, `page=${nextPage}`);
}

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async function ({ message, data }, sender, sendResponse) {
    if(data){
      statusScrap = "stop";
      let port = chrome.tabs.connect(tab.id, { name:"background-content" });
      port.postMessage({ message: "ok" });
      
      let portPopup = chrome.runtime.connect({ name: "popup-background" });
      portPopup.postMessage({ message: "ok", data: data });
      return;
    }
    if (message === "start") {
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true,});
      if(!tab) return;
      statusScrap = "start";
      let port = chrome.tabs.connect(tab.id, { name:"background-content" });
      port.postMessage({ message: "scrap" });
      // const status = "start";
      // await saveObjectInLocalStorage(status);
    }
    if (message === "next") {
      //const status = await getObjectInLocalStorage("status");
      //if (status == "start")
      // port.postMessage({ message: "nextpage" });
      const url = addNewPagetoURL (sender.sender.tab.url);
      await chrome.tabs.update(sender.sender.tab.id, {
        url: url,
      });
      return;
    }
    if (message === "online" && statusScrap == "start") {
      //const status = await getObjectInLocalStorage("status");
      //if (status == "start")
      port.postMessage({ message: "scrap" });
      return;
    }
  });
});
