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

//clear local storage
function clearLocalStorage() {
  chrome.storage.local.clear(() => {
    console.log("cleared storage");
  });
}

//Verify the next page
function addNewPagetoURL(url) {
  const match = url.match(/page=(\d+)$/);
  if (!match) {
    if (url.endsWith("/")) {
      return url.concat("?page=2");
    } else {
      return url.concat("&page=2");
    }
  }
  const currentPage = match ? parseInt(match[1]) : 1;
  const nextPage = currentPage + 1;
  return url.replace(/page=(\d+)$/, `page=${nextPage}`);
}

//Grouping by Country and Salary
function jobsByLocationAndSalary(jobs) {
  const jobsByLocation = jobs.reduce((cityGroup, job) => {
    const {location, salary} = job;
    if (!location || !salary) return cityGroup;
    cityGroup[location] = cityGroup[location] || [];
    cityGroup[location].push(job);
    return cityGroup;
  }, {});

  let jobsByLocationAndSalary = {};

  console.log(jobsByLocation)

  Object.keys(jobsByLocation).forEach((key) => {
    const jobsGroupBySalary = jobsByLocation[key].reduce((salaryAcc, jobByLocation) => {
      const {salary} = jobByLocation;
      if (!salary) return salaryAcc;
      salaryAcc[salary] = (salaryAcc[salary] || 0) + 1;
      return salaryAcc;
    }, {});
    jobsByLocationAndSalary[key] = [];
    jobsByLocationAndSalary[key].push(jobsGroupBySalary);
  });

  return jobsByLocationAndSalary;
}

//port.onMessage listen to any port
chrome.runtime.onConnect.addListener(function (port) {
  let allJobs = [];

  port.onMessage.addListener(async function ({ message, jobs }, { sender }) {
    if (message === "start") {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab) return;
      statusScrap = "start";
      clearLocalStorage();

      let port = chrome.tabs.connect(tab.id, { name: "background-content" });
      port.postMessage({ message: "scrap" });
      return;
    }

    if (message === "next") {

      const currentJobs = await getObjectInLocalStorage("jobs");
      let jobsOutput = (JSON.stringify(currentJobs) === "{}") 
        ? jobs 
        : [...Object.values(currentJobs.jobs), ...jobs];

      console.log("Output", jobsOutput);
      await saveObjectInLocalStorage({ jobs: jobsOutput });

      const url = addNewPagetoURL(sender.tab.url);
      await chrome.tabs.update(sender.tab.id, {
        url: url,
      });

      return;
    }

    if (message === "online" && statusScrap === "start") {
      port.postMessage({ message: "scrap" });
      return;
    }

    if (message === "finish" || message === "stop") {
      
      statusScrap = "stop";

      const lastJobs = await getObjectInLocalStorage("jobs");

      let jobsOutput = (JSON.stringify(lastJobs) === "{}") 
        ? jobs 
        : [...Object.values(lastJobs.jobs), ...jobs];

      await saveObjectInLocalStorage({ jobs: jobsOutput });

      const jobsStorage = await getObjectInLocalStorage("jobs");
      const jobsArray = Object.values(jobsStorage.jobs);
      const jobsFinal = jobsByLocationAndSalary(jobsArray);

      console.log(jobsFinal);

      let portPopup = chrome.runtime.connect({ name: "popup-background" });
      portPopup.postMessage({ message: "offline", jobs: jobsFinal });
      return;
    }
  });
});