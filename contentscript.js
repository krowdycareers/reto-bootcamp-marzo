console.log("Ejecutando el content script 6.0");

function getJobInformation() {
  const elemCardJobs = [...document.querySelectorAll("[id*='jobcard-']")];
  const jobs = elemCardJobs.map((job) => {
    const [
      { href: url },
      {
        children: [
          {
            children: [
              { innerText: fecha },
              { innerText: title },
              { innerText: salario },
              { innerText: beneficios },
              {},
              {
                children: [elementEmpresaCiudad],
              },
            ],
          },
        ],
      },
    ] = job.children;

    const empresa = elementEmpresaCiudad?.querySelector("label")?.innerText;
    const ciudad = elementEmpresaCiudad?.querySelector("p")?.innerText;

    return { url, fecha, title, salario, beneficios, empresa, ciudad };
  });

  return jobs;
}

function clickNextButton() {
  const nextPageButton = document.querySelector("[class*=next-]");
  nextPageButton.click();
}

//Connect to background
const portBackground = chrome.runtime.connect({ name: "content-background" });

portBackground.postMessage({message: "online"})
portBackground.onMessage.addListener(async ({message}) => {
  if (message === "scrap") {
    const jobs = getJobInformation();
    clickNextButton();
  }
})

portBackground.onMessage.addListener(async ({ message, status }) => {
  if (message === "online") {
    alert(status)
  }
});

//Connect from popup
chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function ({ message }) {
    if ((message = "scrap")) {
      const jobs = getJobInformation();
      const nextPageButton = document.querySelector("[class*=next-]");
      const message = !!nextPageButton ? "next" : "";
      portBackground.postMessage({message});
      // port.postMessage({message: "ok", data: jobs})
      // portBackground.postMessage({ message: "finish" });
    }
  });
});
