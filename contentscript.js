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
              { innerText: fecha },
              { innerText: title },
              { innerText: salario },
              { innerText: beneficios },
              {},
              {
                children: [elementEmpresCiudad],
              },
            ],
          },
        ],
      },
    ] = cardJob.children;
    const empresa = elementEmpresCiudad?.querySelector("label")?.innerText;
    const ciudad = cardJob?.querySelector("p a[class*=metalink]").innerText;
    let salarioFinal = "No mostrado";
    const showSalario = salario.split(" ").filter(amount => amount.charAt(0)=='$');
    if(showSalario) salarioFinal = showSalario.length > 1 ? showSalario[0]+" "+showSalario[1]:showSalario[0];
    salarioFinal = salarioFinal === undefined? "No mostrado": salarioFinal;
    return { url, fecha, title, salarioFinal, beneficios, empresa, ciudad };
  });

  const justCities = jobs.map(element =>{ return element?.ciudad});
  const cities = justCities.filter((item,index)=>{
    return justCities.indexOf(item) === index;
  });
  console.log(cities)

  const justSalary = jobs.map(element => {return element?.salarioFinal})
  const salaries = justSalary.filter((item,index)=>{
    return justSalary.indexOf(item) === index;
  });
  console.log(salaries);

  const jobsForCity = [];
  cities.forEach(_city =>{
    const auxJobs = jobs.filter(job => job.ciudad == _city).map(jobCity => {return jobCity.salarioFinal});
    const numSalary = [];
    salaries.forEach(elem =>{
      let cont = auxJobs.filter(_salary => _salary == elem).length;
      if(cont != 0) numSalary.push({sal: elem, num:cont});
    })
    jobsForCity.push({title:_city,data:numSalary})
  })

  return jobsForCity;
}

function clickNextButton(){
  const nextPageBtn = document.querySelector("[class*=next-]");
  nextPageBtn.click();
}

//Connect to background
const portBackground = chrome.runtime.connect({ name: "content-background" });

function waitFor (ms){
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

portBackground.postMessage({ message: "online" });
portBackground.onMessage.addListener(async ({ message }) => {
  if ((message = "scrap")) {
    waitFor (3000);
    const jobs = getJobInformation();
    const nextPageButton = document.querySelector("[class*=next-][class*=disabled-]");
    console.log("btn11: ",nextPageButton)
    // const message = nextPageButton? "next" : "ok";
    console.log("btn1: ",message)
    if(nextPageButton){
      console.log("ok")
      portBackground.postMessage({ message: "ok", data: jobs });
    } else {
      console.log("next")
      portBackground.postMessage({ message: "next", data: null});
    }
  }
});

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function ({ message }) {
    if (message === "scrap") {
      const jobs = getJobInformation();
      const nextPageButton = document.querySelector("[class*=next-][class*=disabled-]");
      console.log("btn22: ",nextPageButton)
      if(nextPageButton){
        console.log("ok")
        port.postMessage({ message: "ok", data: jobs });
      } else {
        console.log("next")
        portBackground.postMessage({ message: "next", data: null});
      }
      }
    });
});
