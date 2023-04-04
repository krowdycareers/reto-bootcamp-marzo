const btnScripting = document.getElementById("btnPaginar");
const mensajeInicial = document.getElementById("mensajeInicial");
const divScripping = document.getElementById("infoScrapping");

btnScripting.addEventListener("click", async () => {
  const port = chrome.runtime.connect({ name: "popup-background" });
  port.postMessage({ message: "start" });
  chrome.runtime.onMessage.addListener(async function (request,_sender,_sendResponse) {
    //pMensaje.innerText= JSON.stringify(request.data,null,2)
    mensajeInicial.style.display = "none";
    let html = "";
    const jobsStadistic = request.data;
    for (const city in jobsStadistic) {
      const cityRefactor = city === "" ? "Sin ciudad" : city;
      html += "<label><strong>"+cityRefactor+"</strong></label>";
      jobsStadistic[city].forEach((salaries) => {
        for (const salaryByCity in salaries) {
          html +=`<p>${salaryByCity}: ${salaries[salaryByCity]}</p>`
        }
      })
    }
    divScripping.innerHTML=html;
  });
});
