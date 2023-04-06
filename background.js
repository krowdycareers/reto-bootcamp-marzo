let statusScrap = "stop";

const saveObjectInLocalStorage = async function (obj) {
  return new Promise((resolve, reject) => {
    try{
      chrome.storage.local.set(obj, function () {
        resolve();
      });
    } catch(ex) {
      reject(ex);
    } 
  });
};

const getObjectInLocalStorage = async function (key) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get([key], function (value) {
        resolve(value);
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

//Limpiar el chrome local storage
function clearStorage(){
  chrome.storage.local.clear(() => {
    console.log('Todo fue eliminado');
  });
}

//Modificar el paginado
function addPagetoURL(url){
  const regex = /page=(\d+)/;
  const match = url.match(regex);
  if (!match) {
    if (url.endsWith("/")) {
      return url.concat("?page=2");
    } else {
      return url.concat("&page=2");
    }
  }
  const page = match && match[1];
  const newPage = parseInt(page) + 1;
  return url.replace(regex, `page=${newPage}`);
}


//Ordenamiento de los trabajos scrapeados
function jobsForCountrySalary(jobs){
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

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener( async function ({ message, jobs }, sender) {
    if (message === "start"){
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if(!tab) return;
      statusScrap = "start";
      clearStorage();
      let port = chrome.tabs.connect(tab.id, { name: "background-content" });
      port.postMessage({ message: "scrap" });
      return;
    }

    if (message === "next"){
      //Obtenemos el objeto del local storage
      const objectJobsInicial = await getObjectInLocalStorage("jobs");

      //Si esta vacio, asignamos directamente el array de Jobs scrapeados
      if(JSON.stringify(objectJobsInicial) === "{}"){
        jobsSalida = jobs;
      }else{
        //Si contiene datos, es otra pagina, solo realizamos push
        jobsSalida = Object.values(objectJobsInicial.jobs);
        jobsSalida.push(...jobs);
        console.log(jobsSalida);
      }
      
      console.log("salida", jobsSalida )
      //Volvemos a guardar el objeto en el localStorage
      await saveObjectInLocalStorage({jobs: jobsSalida});

      const url = addPagetoURL(sender.sender.tab.url);
      await chrome.tabs.update(sender.sender.tab.id , {
        url: url,
      });
      return;
    }

    if (message === "online" && statusScrap === "start"){
      port.postMessage({ message: "scrap" });
      return
    }

    if (message === "finish"){
      //Guardamos los ultimos jobs scrapeados
      const objectJobsInicial = await getObjectInLocalStorage("jobs");

      if(JSON.stringify(objectJobsInicial) === "{}"){
        jobsSalida = jobs;
      }else{
        jobsSalida = Object.values(objectJobsInicial.jobs);
        jobsSalida.push(...jobs);
        console.log(jobsSalida);
      }
      
      //console.log("salida", jobsSalida )
      await saveObjectInLocalStorage({jobs: jobsSalida});
      const jobsStorage = await getObjectInLocalStorage("jobs");
      const jobsScraped = Object.values(jobsStorage.jobs)
      const jobsFinal = jobsForCountrySalary(jobsScraped);
      chrome.runtime.sendMessage({ message: "ok", data: jobsFinal });
    }
    
  });
});