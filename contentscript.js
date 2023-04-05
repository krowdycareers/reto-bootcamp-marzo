console.log("Ejecutando el content script 12.0");

//Connect to background
const portBackground = chrome.runtime.connect({ name: "content-background" });


portBackground.postMessage({message:"online"});

portBackground.onMessage.addListener(async ({ message }) => {
  if (message === "scrap") {
    wait(3000);
    const jobs =getJobInformation();
   /* const port = chrome.runtime.connect({name: "popup-background"});
    port.postMessage({message:"ok", data:jobs}); */
    const nextPageButton = document.querySelector('[class *= next-]');
    const message = !!nextPageButton ? "next": "";
    portBackground.postMessage({message,data:jobs});

  }
});

function wait(ms){
  return new Promise((resolve)=> {
    setTimeout(resolve,ms);
  }
  )

}

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function ({ message }) {
    if (message === "scrap") {
      const jobs =getJobInformation();
     /* const port = chrome.runtime.connect({name: "popup-background"});
      port.postMessage({message:"ok", data:jobs}); */
      const nextPageButton = document.querySelector('[class *= next-]');
      const message = !!nextPageButton ? "next": "";
      portBackground.postMessage({message,data:jobs});

      
      /*portBackground.postMessage({ message: "finish" }); */
    }
  });
});


function getJobInformation() {
  const elementCardJobs= [...document.querySelectorAll('[id*="jobcard-"]')];
  const jobs = elementCardJobs.map((cardJob) => {
    const [
      { href: url },

      {children:[
        {
          children: [
            {},  
            {innerText:title},
            {innerText:salario},
            {innerText:beneficios},
            {children:[elemtEmpresaCiudad]},
            
          ]
        }
      ]
      },

      
      

    
    ] = cardJob.children;


    const empresa=elemtEmpresaCiudad?.querySelector("label")?.innerText;
    const ciudad=elemtEmpresaCiudad?.querySelector("[class *= 'link-0-2']")?.innerText;

    return {url,title,salario,beneficios,empresa,ciudad};
  });

  return jobs;
}
