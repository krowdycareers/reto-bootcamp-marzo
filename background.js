let statusScrap = "stop";

// const saveObjectInLocalStorage = async function (obj) {
//   return new Promise((resolve, reject) => {
//     try {
//       chrome.storage.local.set(obj, function () {
//         resolve();
//       });
//     } catch (ex) {
//       reject(ex);
//     }
//   });
// };

// const gatObjectInLocalStorage = async function (obj) {
//   return new Promise((resolve, reject) => {
//     try {
//       chrome.storage.local.get(key, function (value) {
//         resolve(value);
//       });
//     } catch (ex) {
//       reject(ex);
//     }
//   });
// };

function addNewPagetoURL(url) {
  const regex = /page=(\d+)/;
  const match = url.match(regex);
  const page = match && match[1];
  const nextPage = parseInt(page)+1;
  return url.replace(regex, `page=${nextPage}`);
}
let auxAllData =[];

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async function ({ message, jobsData}, sender, sendResponse) {
    if(message === "ok"){ 
      console.log("en el ok");
      auxAllData = jobsData? auxAllData.concat(jobsData): auxAllData;
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true,});
      if(!tab) return;
      statusScrap = "stop";
      let portContent = chrome.tabs.connect(tab.id, { name:"background-content" });
      portContent.postMessage({ message: "ok", jobsData: auxAllData});
      return;
    }
    if (message === "start") {
      console.log("en el start");
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true,});
      if(!tab) return;
      statusScrap = "start";
      let portContent = chrome.tabs.connect(tab.id, { name:"background-content" });
      portContent.postMessage({ message: "scrap"});
      return;
    }
    if (message === "next") {
      console.log("en el next");
      auxAllData = jobsData? auxAllData.concat(jobsData): auxAllData;
      const url = addNewPagetoURL (sender.sender.tab.url);
      await chrome.tabs.update(sender.sender.tab.id, {
        url: url,
      });
      return;
    }
    if (message === "online" && statusScrap == "start") {
      console.log("en el online");
      port.postMessage({ message: "scrap" });
      return;
    }
    if(message === "show"){
      console.log("en el show");
      console.log(jobsData);
      const portPopup = chrome.runtime.connect({ name: "content-popup" });
      portPopup.postMessage({ message: "show", data: jobsData });
      return;
    }
  });
});
