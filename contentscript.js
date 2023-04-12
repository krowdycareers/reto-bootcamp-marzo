console.log("Ejecutando el content script 1.0");

const jobsScraping = () => {
  let cardsJobs = Array.from(document.querySelectorAll("[id*='jobcard-']"));
  const jobs = cardsJobs.map((cardJob) => {
    return {
      date: cardJob.querySelector("[class*='date-']").textContent,
      title: cardJob.querySelector("h2").textContent,
      salary: cardJob.querySelector("[class*='salary-']").textContent,
      benefits: {
        ...Array.from(cardJob.querySelectorAll("ul")).map((ul) =>
          Array.from(ul.querySelectorAll("li"), (li) => li.textContent)
        ),
      },
      description: cardJob.querySelector("[class*='descriptionText-']")
        .textContent,
      company: cardJob.querySelector("[class*='linkContainer-']").textContent,
      city: cardJob.querySelector("[class*='zonesLinks-']").textContent,
      url:
        "https://www.occ.com.mx" +
        cardJob.querySelector("a[class*='jobcard-']").getAttribute("href"),
    };
  });
  return jobs;
};

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function ({ message }) {
    if (message === "getJobs") {
      const jobs = jobsScraping();
      port.postMessage({ message: "ok", data: jobs });
    }
  });
});

//Connect to background
const port = chrome.runtime.connect({ name: "content-background" });
port.postMessage({ message: "Hola Background" });
port.onMessage.addListener(async ({ message }) => {
  alert(message);
});
