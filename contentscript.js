console.log("Ejecutando el content script 1.0");

function getJobInformation() {
  const elemCardJobs  =[...document.querySelectorAll('[id*="jobcard-"]')]
  const jobs = elemCardJobs.map((cardJob) =>{
    return {
      url: cardJob.querySelector("a[class*='jobcard-']").href,
      date: cardJob.querySelector("[class*='date-']").textContent,
      title: cardJob.querySelector("h2[class*='text-']").textContent,
      salary: cardJob.querySelector("span[class*='salary-']").textContent,
      country: cardJob.querySelector("p[class*='text-']").textContent
    };
  });

  return jobs;
}

function clickNextButton(){
  const botonNextPage = document.querySelector("[class*=next-]");
  botonNextPage.click();
}
//Connect to background
const portBackground = chrome.runtime.connect({ name: "content-background" });

function wait(ms){
  return new Promise((resolve) =>{
    setTimeout(resolve, ms);
  });
}

portBackground.postMessage({message: "online"});

portBackground.onMessage.addListener(async ({ message }) => {
  if (message === "scrap"){
    wait(3000);
    const jobs = getJobInformation();
    const botonNextPage = document.querySelector("[class*=next-]");
    //Validar si el boton contiene disabled para definir el mensaje
    const message = !botonNextPage.classList.contains("disabled-0-2-601") ? "next" : "finish";
    portBackground.postMessage({ message, jobs });
  } 

});

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function ({ message }) {
    if (message === "scrap"){
      const jobs = getJobInformation();
      const botonNextPage = document.querySelector("[class*=next-]");
      const message = !botonNextPage.classList.contains("disabled-0-2-601") ? "next" : "finish";
      portBackground.postMessage({ message, jobs });
    } 

  });

});

