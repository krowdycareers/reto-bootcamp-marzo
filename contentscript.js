console.log("Ejecutando el content script 1.0");
function verifyBenefits(benefits) {
  if (benefits.className.includes("fresnel-container")) {
    return "No se detalla";
  }
  return (benefits = benefits.innerText.split("\n"));
}

function getJobsInformation() {
  const elementCardJobs = [...document.querySelectorAll("[id^='jobcard-']")];
  const jobs = elementCardJobs.map((cardJob) => {
    let [
      { href: url },
      {
        children: [
          {
            children: [
              { innerText: date },
              { innerText: title },
              { innerText: salary },
              benefits,
              infoCompany,
            ],
          },
        ],
      },
    ] = cardJob.children;

    if (infoCompany.className.includes("fresnel-container")) {
      infoCompany = infoCompany.nextSibling;
    }

    [infoCompany] = infoCompany.children;
    const companyName = infoCompany?.querySelectorAll("label")[0].innerText;
    const companyCity = infoCompany?.querySelectorAll("p")[0].innerText;

    return {
      url,
      date: date.split("\n")[0],
      title,
      salary,
      benefits: verifyBenefits(benefits),
      companyName,
      companyCity,
    };
  });
  return jobs;
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

//Connect to background
const portBackground = chrome.runtime.connect({ name: "content-background" });

portBackground.postMessage({ message: "online" });

function scrappingPages() {
  const jobsByCity = getJobsInformation();
  const nextPageBtn = document.querySelector("[class*='next-']");
  const message = !nextPageBtn.className.includes("disabled-")
    ? "next"
    : "stop";
  console.log(message);
  portBackground.postMessage({ message, data: jobsByCity });
}

portBackground.onMessage.addListener(async ({ message }) => {
  if (message === "scrap") {
    wait(3000);
    scrappingPages();
  }
});

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function ({ message }) {
    console.log(`${port.name}: message`);
    if (message === "scrap") {
      scrappingPages();
    }
  });
});
