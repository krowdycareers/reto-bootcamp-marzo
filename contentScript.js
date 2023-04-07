console.log("Ejecutando el content script");

function getJobInformation() {
  const elemJobCards = [...document.querySelectorAll('[id*="jobcard-"]')];
  const jobs = elemJobCards.map((jobCard) => {
    const [
      { href: url },
      {
        children: [
          {
            children: [
              { innerText: date },
              { innerText: title },
              { innerText: salary },
              { innerText: benefits },
            ],
          },
        ],
      },
    ] = jobCard.children;

    const company = jobCard.querySelector("[class*=locContainer]")?.innerText;
    const city =
      jobCard.querySelectorAll("a[class*=metalink]")[
        jobCard.querySelectorAll("a[class*=metalink]")?.length - 1
      ]?.innerText;
    return { url, date, title, salary, benefits, company, city };
  });

  return jobs;
}

//Connect to background
const portBackground = chrome.runtime.connect({ name: "content-background" });

function scrap() {
  const data = getJobInformation();
  portBackground.postMessage({ message: "saveandnext", data });
}

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function ({ message }) {
    if (message === "start") {
      scrap();
    }
  });
  portBackground.onMessage.addListener(async ({ message, data }) => {
    if (message === "nextpage") {
      const nextPageButton = document.querySelector("[class*=next-]");
      if (nextPageButton.className.includes("disabled")) {
        return portBackground.postMessage({ message: "nomorepages" });
      }
      nextPageButton.click();
      portBackground.postMessage({ message: "morejobs" });
    }
    if (message === "scrap") {
      scrap();
    }
    if (message === "finish") {
      console.log("FINISh: ", data)
      port.postMessage({ message: "ok", data });
    }
  });
});
