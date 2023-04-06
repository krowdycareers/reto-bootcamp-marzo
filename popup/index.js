const btnScripting = document.getElementById("btnPaginar");
const pMensaje = document.getElementById("mensajes");

btnScripting.addEventListener("click", async () => {
  const port = chrome.runtime.connect({name:"popup-background"})
  port.postMessage({message: "start"});
  pMensaje.innerText = "Scraping..."
  chrome.runtime.onMessage.addListener(async function({ message, data }) {
    if (message == "ok") {
      //Limpiar el elemento
      pMensaje.innerHTML="";
      //pMensaje.innerText = JSON.stringify(data, null,2);
      pMensaje.innerHTML = jobsStyleMessage(data);
    }
  });
});

function jobsStyleMessage(data){
  var html = "";
  for(var city in data){
    const cityRefactor = city === "" ? "Sin ciudad" : city;
    html += '<h2 style="text-align:center">'+ cityRefactor +'</h2>'+ '</br>';
      data[city].forEach((salaries) => {
        for (const salaryByCity in salaries) {
          
          html += '<h3 style="padding-left:20px;">'+ salaryByCity + " : " + salaries[salaryByCity] +'</h3>'+ '</br>';
        }
      })
    html += "--------------------------------------------------------------------------------------------------"
  }

  return html;
};

/*btnScriptingBackground.addEventListener("click", async () => {
  var port = chrome.runtime.connect({ name: "popup-background" });
  port.postMessage({ message: "Hola BD" });
  port.onMessage.addListener(function ({ message }) {
    alert(message);
  });
});*/


