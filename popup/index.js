const btnScripting = document.getElementById("btncomunicacion");
const pMensaje = document.getElementById("mensajes");
const finalData = document.querySelector(".popup-body");

btnScripting.addEventListener("click", async () => {
  let port = chrome.runtime.connect({ name: "popup-background" });
  port.postMessage({ message: "start" });
});

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async function ({ message, data}) {
    console.log("aqui index", message, data); 
    if (message == "show"){
      // port.postMessage({ message: "finish" });
      const showData = [...data]
      // console.log(showData)
      pMensaje.innerText = "Datos recuperados:";
      showData.forEach(element => {
        card = document.createElement("div");
        card.classList.add("card-show");
        titleText = document.createElement("h3");
        salaryText = document.createElement("div");
        // locationText = document.createElement("p");
        titleText.textContent = element?.title;
        // salaryText.textContent = JSON.stringify(element?.data, null, 2);
        element?.data.forEach(info => {
          salaryAux = document.createElement("div");
          salaryAux.classList.add("salary-box");
          salarieText= document.createElement("p");
          numText= document.createElement("p");
          salarieText.innerText = info?.sal;
          numText.innerText = info?.num;
          salaryAux.appendChild(salarieText);
          salaryAux.appendChild(numText);
          salaryText.appendChild(salaryAux);
        });
        // locationText.textContent = element?.ciudad;
        card.appendChild(titleText);
        card.appendChild(salaryText);
        // card.appendChild(locationText);
        finalData.appendChild(card);
      });
    }
  });
});
