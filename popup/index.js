const btnScripting = document.getElementById("btncomunicacion");
const btnScriptingBackground = document.getElementById("btncomunicacionbckg");
const pMensaje = document.getElementById("mensajes");

btnScripting.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });
    let port = chrome.tabs.connect(tab.id, { name: "popup" });
    port.postMessage({ message: "getJobs" });
    port.onMessage.addListener(({ message, data }) => {
        if (message == "ok") pMensaje.innerText = JSON.stringify(data, null, 2);
    });
});

btnScriptingBackground.addEventListener("click", async () => {
    var port = chrome.runtime.connect({ name: "popup-background" });
    port.postMessage({ message: "Hola BD" });
    port.onMessage.addListener(function ({ message }) {
        alert(message);
    });
});
