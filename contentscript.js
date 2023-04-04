const getJobsInformation = () => {

  const jobCard = [...document.querySelectorAll('[id*="jobcard-"]')];
  const content = jobCard.map((job) => {
      const [
        { href: url },
        {
          children: [
            {
              children: [
                { innerText: date },
                { innerText: title },
                { innerText: rangeSalary },
                { innerText: details},
                {
                  children: [tagCompanyCity]
                }
              ],
            },
          ],
        },
      ] = job.children;

      const company = tagCompanyCity?.querySelector("label")?.innerText;
      const city = tagCompanyCity?.querySelector("p")?.innerText;

      return [
        url,
        date,
        title,
        rangeSalary,
        company,
        city
      ];
  });
  return content;
}

// function clickNextButton() {
//   const nextPageButton = document.querySelector("[class*=next-]");
//   nextPageButton.click();
// }

const portBackground = chrome.runtime.connect({ name: "contentscript-background" });
portBackground.postMessage({ message: "online",data: {}, status_:""  });
portBackground.onMessage.addListener(async ({ message, jobFiltered}) => {

  if (message === "scrap"){
    const jobs = getJobsInformation();
    const nextPageButton = document.querySelector("[class*=next-]");
    const message = !!nextPageButton ? 'next' : "";

    const classList = nextPageButton.classList.toString();
    const regex = /disabled-/;
    const isDisabled = classList.match(regex);
    console.log(classList);
    console.log(isDisabled);


    if (isDisabled) {
      portBackground.postMessage({message: message, data:jobs, status_: "stop"})
    }else{
      portBackground.postMessage({message: message, data:jobs, status_: "start"})
    }
    //Connect to background
    return;
  }

  if (message === "endScrap"){
    chrome.runtime.sendMessage({data: jobFiltered}, function(response) {
      console.log(response);
    });
  }

});



console.log("Ejecutando el content script 1.0");

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function ({ message }) {
    // alert(`${port.name}: message`);
    if (message === "scrap"){
      //Connect to background
      const jobs = getJobsInformation();
      const nextPageButton = document.querySelector("[class*=next-]");
      const message = !!nextPageButton ? 'next' : "";
      portBackground.postMessage({message: message, data: jobs, status_:"start"})
      

      //alert("hola");
    }
    // port.postMessage({ message: "Como estas?" });
  });
});


