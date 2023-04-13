const btnScripting = document.getElementById("btncomunicacion");
const btnScriptingBackground = document.getElementById("btncomunicacionbckg");
const pMensaje = document.getElementById("mensajes");
const jobsDiv = document.getElementById("jobs");

btnScripting.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let port = chrome.tabs.connect(tab.id, { name: "popup" });
  port.postMessage({ message: "getJobs" });
  port.onMessage.addListener(({ message, data }) => {
    if (message == "ok") {
      jobsDiv.removeChild(pMensaje);
      jobsDiv.appendChild(createTable(data));
    }
  });
});

// btnScriptingBackground.addEventListener("click", async () => {
//   var port = chrome.runtime.connect({ name: "popup-background" });
//   port.postMessage({ message: "startscrap" });
//   port.onMessage.addListener(({ message }) => alert(message));
// });

function createTable(data) {
  const table = document.createElement("table");
  table.setAttribute("border", "1");
  const thead = document.createElement("thead");
  const thRow = document.createElement("tr");
  thRow.appendChild(
    document.createElement("th").appendChild(document.createTextNode("Ciudad"))
  );
  thRow.appendChild(
    document
      .createElement("th")
      .appendChild(document.createTextNode("Cantidad"))
  );
  thead.appendChild(thRow);
  const tbody = createBody(data);
  table.appendChild(thead);
  table.appendChild(tbody);
  return table;
}

function createBody(data) {
  const tbody = document.createElement("tbody");
  Object.entries(data).forEach((entry) => {
    const row = document.createElement("tr");
    row.appendChild(
      document
        .createElement("td")
        .appendChild(document.createTextNode(entry[1]["city"]))
    );
    row.appendChild(
      document
        .createElement("td")
        .appendChild(document.createTextNode(entry[1]["quantity"]))
    );
    tbody.appendChild(row);
  });
  return tbody;
}
