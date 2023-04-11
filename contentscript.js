console.log("Ejecutando el content script 1.0");

function getJobsInfo() {
  const elemCardJobs = [...document.querySelectorAll('[id*="jobcard-"]')];
  const jobElement = elemCardJobs.map((cardjob) => {
    const [
      { href: url },
      {
        children: [
          {
            children: [
              {
                children: [
                  {
                    children: [
                      {
                        children: [{ innerText: fecha }],
                      },
                    ],
                  },
                ],
              },
              { innerText: titulo }
            ],
          },
        ],
      },
    ] = cardjob.children;
    salario = cardjob.querySelector("[class*='salary-']").textContent;
    beneficios = [...cardjob.querySelectorAll("li")].map((Elementli) => Elementli.textContent);
    ciudad = [...cardjob.querySelectorAll("[class*=metalink]")].map((El)=>El.textContent);
    //empresaDescripcion = cardjob.querySelector("[class*='descriptionText-']").textContent;
    empresaNombre = cardjob.querySelector("[class*='linkContainer-']").textContent;
    return {
      url,
      fecha,
      titulo,
      salario,
      empresaNombre,
      ciudad,
      beneficios
    };
  });
  return jobElement;
}

//Connect to background
const portBackground = chrome.runtime.connect({ name: "content-background" });

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

portBackground.postMessage({ message: "online" })
portBackground.onMessage.addListener(async ({ message }) => {
  if (message === "scrap") {
    console.log("scrap 1");
    let message;
    wait(3000);
    const jobs = getJobsInfo();
    const nextPageButton = document.querySelector("[class*=next-][class*=disabled-]");
    if (!nextPageButton) {
      message = "next";
      portBackground.postMessage({ message, data: jobs });
    } else {
      message = "stop";
      portBackground.postMessage({ message, data: jobs });
    }
  }
});

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function ({ message }) {
    if (message === "scrap") {
      let message;
      const jobs = getJobsInfo();
      const nextPageButton = document.querySelector("[class*=next-][class*=disabled-]");
      if (!nextPageButton) {
        message = "next";
        portBackground.postMessage({ message, data: jobs });
      } else {
        portBackground.postMessage({ message, data: jobs });
      }
    }
  });
});

