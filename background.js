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
      chrome.storage.local.get(key, function (value) {
        resolve(value);
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

function addPageToURL(url) {
  const regex = /page=(\d+)/;
  const match = url.match(regex);

  if (!match) {
    if (url.endsWith("/")) {
      return url.concat("?page=2");
    } else {
      return url.concat("&page=2");
    }
  }

  const pageNumber = match && match[1];
  const newPage = parseInt(pageNumber) + 1;
  return url.replace(regex, `page=${newPage}`);
}

async function refreshJobsLocalStorage(jobs) {
  const { jobs: currentJobs = [] } = await getObjectInLocalStorage("jobs");
  const allJobs = [...currentJobs, ...jobs];
  await saveObjectInLocalStorage({ jobs: allJobs });
}

function groupJobsByCity(jobs) {
  const groupedJobs = jobs.reduce((acc, job) => {
    const { city, salary } = job;

    const regex = /(\$[\d,]+)\s*-\s*(\$[\d,]+)/;
    const salaryRange = salary.match(regex);

    const minSalary = salaryRange
      ? parseInt(salaryRange[1].replace(/[\$,]/g, ""))
      : null;
    const maxSalary = salaryRange
      ? parseInt(salaryRange[2].replace(/[\$,]/g, ""))
      : null;
    const index = acc.findIndex((group) => group.city === city);

    if (index === -1) {
      acc.push({ city, jobs: [job], count: 1, minSalary, maxSalary });
    } else {
      acc[index].jobs.push(job);
      acc[index].count++;
      acc[index].minSalary = Math.min(acc[index].minSalary, minSalary);
      acc[index].maxSalary = Math.max(acc[index].maxSalary, maxSalary);
    }

    return acc;
  }, []);

  return groupedJobs;
}

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async function ({ message, jobs }, sender) {
    if (message === "start") {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab) return;
      statusScrap = "start";
      let port = chrome.tabs.connect(tab.id, { name: "background-content" });
      port.postMessage({ message: "scrap" });

      return;
    }
    if (message === "next") {
      await refreshJobsLocalStorage(jobs);

      const url = addPageToURL(sender.sender.url);
      await chrome.tabs.update(sender.sender.tab.id, {
        url: url,
      });
      return;
    }
    if (message === "online" && statusScrap === "start") {
      port.postMessage({ message: "scrap" });

      return;
    }
    if (message === "finish") {
      statusScrap = "stop";
      const { jobs: data = [] } = await getObjectInLocalStorage("jobs");
      const groupJobs = groupJobsByCity(data);
      chrome.runtime.sendMessage({ message: "ok", data: groupJobs });
      //port.postMessage({ message: "stop" });
      return;
    }
  });
});
