const btnScripting = document.getElementById("btnscript");
const pMessage = document.getElementById("mensajes");

btnScripting.addEventListener("click", async () => {
  const port = chrome.runtime.connect({name: "poup-to-background"});
  port.postMessage({message: "start"});

  port.onMessage.addListener(({message,data}) => {
    if(message=="finished2") pMessage.innerText = JSON.stringify(data,null,2);
  });
}); 


