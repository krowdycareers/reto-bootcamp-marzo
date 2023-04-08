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
      numSalary.push({sal: elem, num:cont});
    })
    jobsForCity.push({title:_city,data:numSalary})
  })

  return jobsForCity;
}

//Connect to background
const portBackground = chrome.runtime.connect({ name: "content-background" });

portBackground.onMessage.addListener(async ({ message }) => {
  if ((message = "nextpage")) {
    const nextPageButton = document.querySelector("[class*=next-]");
    nextPageButton.click();
  }
});

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function ({ message }) {
    if (message === "getJobs") {
      const jobs = getJobInformation();
      port.postMessage({ message: "ok", data: jobs });
      portBackground.postMessage({ message: "finish" });
    }
  });
});
