console.log("Ejecutando el content script 0.1.0");

async function esperar(time) {
  await new Promise((resolve) => setTimeout(resolve, time));
}

async function waitForSelector(selector) {
  let status = false;
  while (!status) {
    const elemento = document.querySelector(selector);
    elemento ? (status = true) : await esperar(100);
  }
}

async function getJobsList() {
  await waitForSelector('[id*="jobcard-"]');
  let listCardJobs = [...document.querySelectorAll('[id*="jobcard-"]')];
  let jobs = listCardJobs.map((item) => {
    let titulo = item.querySelector("div>div>div>div>h2").innerText;
    let salario = item.querySelector("div>div>div>span").innerText;
    let ciudad = item.querySelector("div>div>div>div>div>div>div>p").innerText;
    return { titulo, salario, ciudad };
  });
  return jobs;
}

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async function ({ message }) {
    if (message === "getJobs") {
      portBackground.postMessage({ message: "startscrap" });
    }
  });

  const portBackground = chrome.runtime.connect({ name: "content-background" });

  portBackground.onMessage.addListener(async ({ message, data }) => {
    if (message == "nextpage") {
      const nextPageButton = document.querySelector("[class*=next-]");
      if (nextPageButton) {
        nextPageButton.click();
      }
    }
    if (message == "repeat") {
      const jobs = await getJobsList();
      let nextPageButton = document.querySelector("[class*=next-]");
      if (!nextPageButton.className.includes("disabled-")) {
        nextPageButton.click();
        portBackground.postMessage({ message: "next", data: jobs });
      } else {
        portBackground.postMessage({ message: "finish", data: jobs });
      }
    }
    if (message == "resume") {
      port.postMessage({ message: "end", data });
    }
  });
});
