const saveObjectInlocalStorage = async function (obj) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set({ jobs: obj });
    } catch (ex) {
      reject(ex);
    }
  });
};

const getObjectInlocalStorage = async function (obj) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get("jbos", function (value) {
        resolve(value);
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async function ({ message }) {
    if (message === "startscrap") {
      // const status = "start";
      await saveObjectInlocalStorage("message");
    }
    if (message === "finish") {
      //   const status = await getObjectInlocalStorage("status");

      //   if (status == "start") {
      port.postMessage({ message: "nextpage" });
      //   }
    }
  });
});
