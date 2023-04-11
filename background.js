
let statusScrap = 'stop';
let jobsTotal = [];
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

const getObjectInLocalStorage = async function (obj) {
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
  port.onMessage.addListener(async function ({ message,data }, sender, sendResponse) {
    
    if (message === "start") {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if(!tab) return;
      statusScrap = 'start';
      let portContent = chrome.tabs.connect(tab.id, { name: "background-content" });
      portContent.postMessage({ message: "scrap" });
      return;
    }

    if (message === "next") {
      const url = addNewPagetoURL(sender.sender.tab.url);
      await chrome.tabs.update(sender.sender.tab.id,
        {
          url: url,
        });
        jobsTotal= [...jobsTotal, ...data]
      return;
    }
    if (message === "stop") {
        jobsTotal= [...jobsTotal, ...data]
      return;
    }

    if (message === "online" && statusScrap == 'start') {
      port.postMessage({ message: "scrap" });
      return;
    }

    if(message=='finish'){
      port.postMessage({ message: 'finish', data: jobsTotal });
      jobsTotal = [];
      return;
    }

  });
}); 
 