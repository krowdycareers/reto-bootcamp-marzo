const saveObjectInLocalStorage = async function (obj) {
  return new Promise((res, rej) => {
    try {
      chrome.storage.local.set(obj, function () {
        res();
      });
    } catch (ex) {
      rej(ex);
    }
  });
};
const getObjectInLocalStorage = async function (obj) {
  return new Promise((res, rej) => {
    try {
      chrome.storage.local.get(key, function (value) {
        res(value);
      });
    } catch (ex) {
      rej(ex);
    }
  });
};
let irSiguiente = false;
let final = 0;
let totaljobs = [];
chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async function ({ message, pagFinal, jobs }) {
    if (message === "startscrap") {
      const status = "start";
      await saveObjectInLocalStorage(status);
    }
    // if (message === "Hola BD")
    //   port.postMessage({ message: "Te hablo desde el background popup" });
    // if (message === "cargo la pagina")
    //   port.postMessage({ message: "Te hablo desde el background content" });
    if (message === "finish") {
      // const status = await getObjectInLocalStorage("status")
      // }
      // if(message == "start"){
      irSiguiente = true;
      final = pagFinal;
      // port.postMessage({ message: "nextpage" });
      port.postMessage({ message: "sgtePagina", final });
    }
    if (message === "siguiente") {
      console.log(message);
      console.log(irSiguiente);
      if (irSiguiente) {
        port.postMessage({ message: "sgtePagina", final });
      }
    }
    if (message === "jobs") {
      totaljobs.push(jobs);
    }
    if (message === "finalPaginacion") {
      final = 0;
      // port.postMessage({ message: "sendAll", totaljobs });
      let totaljobsfinal = [].concat(...totaljobs);
      chrome.storage.local.set({ trabajos: totaljobsfinal });
      //Para pruebas
      totaljobs = [];
      //----
      console.log("trabajo terminado");
      chrome.runtime.sendMessage({msg:"termine"})
      // port.postMessage({ message: "sendAll"});
    }
  });
});
