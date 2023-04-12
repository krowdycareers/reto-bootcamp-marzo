chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function ({ message }) {
    if (message === "Hola BD")
      port.postMessage({ message: "Te hablo desde el background popup" });
    if (message === "Hola Background")
      port.postMessage({ message: "Te hablo desde el background content" });
  });
});
