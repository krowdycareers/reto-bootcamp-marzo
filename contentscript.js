console.log("Ejecutando el content script 1.0");

function getJobInformation() {
  const elemCardJobs = [...document.querySelectorAll("[id*='jobcard-']")];

  const jobs = elemCardJobs.map((job) => {
    const currentURL = job.querySelector("a[class*='jobcard-']").href;
    const currentDate = job.querySelector("label[class*='date-']").textContent;
    const currentTitle = job.querySelector("h2").textContent;
    const currentSalary = job.querySelector("span[class*='salary-']").textContent;
    const currentLocation = job.querySelector("div[style='flex:1'] p").textContent;
    const currentCompanyName = job.querySelector("div[style='flex:1'] label").textContent;
    const currentBenefits = [...job.querySelectorAll("li[class*='li-']")];


    const benefitsText =
      (currentBenefits.length > 0)
        ? currentBenefits.reduce((acc, benefit) => {
            acc.push(benefit.textContent);
            return acc;
          }, [])
        : "Sin Beneficios";

    //const locationText = [...job.querySelector("div[style='flex:1'] p").childNodes].map((location) => location.textContent)

    return {
      benefits: benefitsText,
      company: currentCompanyName,
      date: currentDate,
      location: currentLocation,
      salary: currentSalary,
      title: currentTitle,
      url: currentURL,
    };
  });

  return jobs;
}

function wait(ms){
  return new Promise((resolve) =>{
    setTimeout(resolve, ms);
  });
}
// chrome.webNavigation.onCompleted.addListener(callback)

//Connect to background
const portBackground = chrome.runtime.connect({ name: "content-background" });

portBackground.postMessage({message: "online"})

portBackground.onMessage.addListener(async ({message}) => {
  if (message === "scrap") {
      const jobs = getJobInformation();
      const nextPageButton = document.querySelector("[class*=next-]");
      const message = !nextPageButton.classList.contains("disabled-0-2-601") ? "next" : "finish";
      portBackground.postMessage({ message, jobs });
  }
})

//port.onMessage listen to any port
chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function ({ message }) {
    if ((message === "scrap")) {
      const jobs = getJobInformation();
      const nextPageButton = document.querySelector("[class*=next-]");
      const message = !nextPageButton.classList.contains("disabled-0-2-601") ? "next" : "finish";
      portBackground.postMessage({ message, jobs });
    }
  });
});


/* //Ordenamiento de los trabajos scrapeados
function jobsForCountrySalary(jobs){
  console.log(jobs)
  //Reduce para ordenar los trabajos por ciudades
  const jobsForCiudad = jobs.reduce((jobsGroup, job) =>{
    const country = job.country;
    if(jobsGroup[country] == null) jobsGroup[country] = [];
    jobsGroup[country].push(job);
    return jobsGroup
  }, {});

  console.log(jobsForCiudad);

  //Para cada ciudad(key) recorremos los elementos y verificamos el salario para realizar el conteo 
  let jobsByCountryAndSalary = {};

  Object.keys(jobsForCiudad).forEach((key) => {
    const jobsGroupBySalary = jobsForCiudad[key].reduce((acc, jobByCity) => {
      if (!acc[jobByCity?.salary]) {
        acc[jobByCity.salary] = 0;
      }
      acc[jobByCity?.salary]++;
      return acc;
    }, {});
    jobsByCountryAndSalary[key] = [];
    jobsByCountryAndSalary[key].push(jobsGroupBySalary);
  });

  return jobsByCountryAndSalary;

}

// Test
const jobsFIltered = getJobInformation()
console.log(jobsForCountrySalary(jobsFIltered)) */