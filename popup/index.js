const btnScripting = document.getElementById("btncomunicacion");
const btnScriptingBackground = document.getElementById("btncomunicacionbckg");
const pMensaje = document.getElementById("mensajes") 

/* btnScripting.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let port = chrome.tabs.connect(tab.id, { name: "popup" });
  port.postMessage({ message: "getJobs" });
  port.onMessage.addListener(({ message, data }) => {
    if (message = "ok") pMensaje.innerText = JSON.stringify(data, null, 2)
  });
}); */

btnScripting.addEventListener("click", async () => {
  const port = chrome.runtime.connect({name: "popup-background"});
  port.postMessage({message: "start"})
  
})

/* btnScriptingBackground.addEventListener("click", async () => {
  var port = chrome.runtime.connect({ name: "popup-background" });
  port.postMessage({ message: "Hola BD" });
  port.onMessage.addListener(function ({ message }) {
    alert(message);
  });
}); */






// const btnScripting = document.getElementById("btnscript");

// btnScripting.addEventListener("click", async () => {
//   const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     func: getJobInformation,
//   });
// });

// function getJobInformation() {
//   const elemCardJobs = [...document.querySelectorAll("[id*='jobcard-']")];
//   const jobs = elemCardJobs.map((job) => {
//     const [
//       { href: url },
//       {
//         children: [
//           {
//             children: [
//               { innerText: fecha },
//               { innerText: title },
//               { innerText: salario },
//               { innerText: beneficios },
//               {},
//               {
//                 children: [elementEmpresaCiudad]
//               }
//             ],
//           },
//         ],
//       },
//     ] = job.children;

//     const empresa = elementEmpresaCiudad?.querySelector("label")?.innerText;
//     const ciudad = elementEmpresaCiudad?.querySelector("p")?.innerText;

//     return { url, fecha, title, salario, beneficios, empresa, ciudad };
//   });

//   console.log(jobs);
// }


// mi versión
// function alertHelloWorld() {
//   const elemCardJobs = [...document.querySelectorAll("[id*='jobcard-']")];

//   const jobs = elemCardJobs.map((job) => {
//     const currentDate = job.querySelector("label[class*='date-']").innerText;
//     const currentTitle = job.querySelector("h2").innerText;
//     const currentSalary = job.querySelector("span[class*='salary-']").innerText;
//     const currentcompanyName = job.querySelector("div[style='flex:1'] label").innerText;
//     const currentCityAndState = job.querySelector("div[style='flex:1'] p").innerText;
//     const currentBenefits = [...job.querySelectorAll("li[class*='li-']")];

//     const benefitsText =
//       (currentBenefits.length > 0)
//         ? currentBenefits.reduce((acc, benefit) => {
//             acc.push(benefit.innerText);
//             return acc;
//           }, [])
//         : "Sin Beneficios";

//     return {
//       date: currentDate,
//       title: currentTitle,
//       salary: currentSalary,
//       benefits: benefitsText,
//       location: currentCityAndState,
//       company: currentcompanyName,
//     };
//   });

//   console.log(jobs);
// }