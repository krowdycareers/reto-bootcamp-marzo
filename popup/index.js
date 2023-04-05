const btnScripting = document.getElementById("btnPaginar");
const pMensaje= document.getElementById("mensajes");
const btnTerminar = document.getElementById("btnTerminar");

btnScripting.addEventListener("click", async () => {
  const port = chrome.runtime.connect({name: "popup-background"});
  port.postMessage({ message: "start" });
  /*port.onMessage.addListener(({message,data}) => {
    if (message='ok') pMensaje.innerText=JSON.stringify(data,null,2)

  }
  )*/
});

btnTerminar.addEventListener("click", async () => {
  const port = chrome.runtime.connect({name: "popup-background"});
  port.postMessage({ message: "finish" });
  port.onMessage.addListener(({message,data}) => {
    if (message='finish') {
      dataModify=getCitiesandSalaries(data);
      pMensaje.innerText= (JSON.stringify(dataModify,null,2));
      alert(JSON.stringify(dataModify,null,2));
    }
    
    
  }
  )
});

function getCitiesandSalaries (data) {
  
  jobsWithCities= data.filter((job)=>(job.ciudad !== undefined));
  jobsWithTitleSalary= jobsWithCities.map(job=> ({title: job.title, salario:job.salario,ciudad:job.ciudad}))
  totalCities=jobsWithCities.map((job)=> job.ciudad);
  cities= Array.from (new Set(totalCities));
  resume=cities.map(city=> {
    const jobFilterByCountry= jobsWithTitleSalary.filter(job=>
job.ciudad.includes(city))
    const rangeSalary= jobFilterByCountry.reduce((ranges,job)=>{
if(!ranges.some(el=>el==job.rangeSalary)) ranges.push({range:job.rangeSalary});
    return ranges
    },[])
    return {city,jobs:jobFilterByCountry}
})

  return resume;
}
/*
btnScriptingBackground.addEventListener("click", async () => {
  var port = chrome.runtime.connect({ name: "popup-background" })
  port.postMessage({ message: "Hola BD" })
  port.onMessage.addListener(function ({ message }) {
    alert(message);
  });
});

*/
