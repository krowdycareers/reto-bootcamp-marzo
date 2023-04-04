let statusScrap = "stop";

const saveObjInLocalStorage = async (key,value) => {
  return new Promise((resolve,reject) => {
    try {
        chrome.storage.local.set({key: value}, function () {
        resolve();  
      });
    } catch (error) {
      reject(error);
    }
  });
}

const getObjInLocalStorage = async (key) => {
  return new Promise((resolve,reject) => {
    try {
      chrome.storage.local.get(key, function (value) {
        resolve(value[key]);
      });
    } catch (error) {
      reject(error);
    }
  });
}

const deleteObjInLocalStorage = async (key) => {
  return new Promise((resolve,reject) => {
    try {
        chrome.storage.local.get(key, function(result) {
          if (result.key !== undefined) {
            chrome.storage.local.remove(key);
            resolve("Se vacio el local Storage");
          } else {
            resolve("La clave no existe");
          }
        });
    } catch (error) {
      reject(error);
    }
  });
}


chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async function ({ message, data, status_ }, sender, sendResponse) {
    if (message === "start"){
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) return;
      statusScrap = status_;
      let portContentScript = chrome.tabs.connect(tab.id, { name: "background-contentscript" });

      //vaciar el LocalStorage
      await deleteObjInLocalStorage("key");
      //
      
      console.log("start");
      portContentScript.postMessage({ message: "scrap" });
      return;
    }
    
    if (message === 'next') {
      // console.log(`tabId: ${JSON.stringify(sender.sender.tab)}`);
      console.log("storages")
      let getDataStorage = await getObjInLocalStorage("key");
      let dataStorage = getDataStorage??[];
      await saveObjInLocalStorage("key",[...dataStorage,...data]);

      console.log("next");
      const url = sender.sender.tab.url;
      const regex = /page=(\d+)/;
      const found = url.match(regex);
      const tmPage = found && found[1];
      const joinSring = `page=${(parseInt(tmPage) + 1)}`;
      const newUrl = url.replace(regex,joinSring);
      // status_ = "stop";

      statusScrap = status_;

      await chrome.tabs.update(sender.sender.tab.id,{
        url: newUrl
      });
      return;
    }

    if (message === "online" && statusScrap === "start") {
      console.log("online");
      port.postMessage({message: "scrap"})
      return;
    }
    
    if (message === "online" && statusScrap === "stop") {
      console.log("stop");
      const getD = await getObjInLocalStorage("key")?? null;
      if (getD) {
        let i=1;

        const getJobByCity = await getD.reduce((acumulator, job) => {
          let key_ = "job" + i;
          const city = job[5]||"sin_nombre";
          if (!acumulator[city]) {
            acumulator[city] = {job}
          }else{
            acumulator[city][key_] = job;
          }
          i++;
          return acumulator;
        },{}) 

        // console.log(getJobByCity);
        let getNroJobBySalaryOfEachCity = {};
        for (const nameCity in getJobByCity) {
            const jobByCity = getJobByCity[nameCity];
            // console.log(jobByCity);
            let qJobsBySalary = {};
            for (const keyJob in jobByCity) {
              const rangSalary = jobByCity[keyJob];
              // console.log(rangSalary);
              if (Object.hasOwnProperty.call(qJobsBySalary, rangSalary[3])) {
                qJobsBySalary[rangSalary[3]]++;
              }else{
                qJobsBySalary[rangSalary[3]] = 1;
              }
            }
            // console.log(qJobsBySalary);
            getNroJobBySalaryOfEachCity[nameCity] = qJobsBySalary;
        }
        console.log(getNroJobBySalaryOfEachCity);
        port.postMessage({message: "endScrap", jobFiltered: getNroJobBySalaryOfEachCity})      
      }     
      return;
    }      
  });
});
