console.log("Ejecutando el content script 2.0");

function getJobInformation() {
  const elemCardJobs = [...document.querySelectorAll('[id*="jobcard-"]')];
  const jobs = elemCardJobs.map((cardJob) => {
    const [
      { href: url },
      {
        children: [
          {
            children: [
              { innerText: date },
              { innerText: title },
              { innerText: salary },
            ],
          },
        ],
      },
    ] = cardJob.children;

    const city = cardJob.querySelector("[class*=zonesLinks-]").textContent;

    return { url, date, title, salary, city };
  });

  return jobs;
}

function clickNextButton() {
  const nextPageButton = document.querySelector("[class*=next-]");
  nextPageButton.click();
}

//Connect to background
const portBackground = chrome.runtime.connect({ name: "content-background" });

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

portBackground.postMessage({ message: "online" });
portBackground.onMessage.addListener(async ({ message }) => {
  if (message === "scrap") {
    wait(3000);
    const jobs = getJobInformation();
    const nextPageButton = document.querySelector("[class*=next-");
    const message = !!nextPageButton ? "next" : "finish";
    portBackground.postMessage({ message, jobs });
  }
});

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function ({ message }) {
    if (message === "scrap") {
      wait(3000);
      const jobs = getJobInformation();
      const nextPageButton = document.querySelector("[class*=next-");
      const message = !!nextPageButton ? "next" : "finish";
      portBackground.postMessage({ message, jobs });
    }
  });
});
