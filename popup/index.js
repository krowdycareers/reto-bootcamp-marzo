const btnScripting = document.getElementById("btnPaginar");
const btnStopScripting = document.getElementById("btnStop");
const pMensaje = document.getElementById("mensajes");
const tableBody = document.querySelector("#table tbody");
// const btnScriptingBackground = document.getElementById("btncomunicacionbckg");

btnScripting.addEventListener("click", async () => {
  const port = chrome.runtime.connect({ name: "popup-background" });
  port.postMessage({ message: "start" });
});

btnStopScripting.addEventListener("click", async () => {
  const port = chrome.runtime.connect({ name: "popup-background" });
  port.postMessage({ message: "stop" });
});

chrome.runtime.onConnect.addListener(function (port) {
  console.log(port.name);
  if (port.name == "popup-background") {
    port.onMessage.addListener(function ({ message, jobs }) {
      if (message === "offline") {
        console.log(jobs);
        console.dir(jobs);
        console.log(Object.keys(jobs));
        console.log(Object.values(jobs));

        const fragment = new DocumentFragment();
        for (const [key, value] of Object.entries(jobs)) {
          const jobsContent = value[0];
          const location = key;
          for (const salaryRange in jobsContent) {
            console.log(salaryRange)
            const row = document.createElement("tr");
            const locationCell = document.createElement("td")
            const rangeCell = document.createElement("td");
            const countCell = document.createElement("td");
            locationCell.textContent = key;
            rangeCell.textContent = salaryRange;
            countCell.textContent = jobsContent[salaryRange];
            row.appendChild(locationCell);
            row.appendChild(rangeCell);
            row.appendChild(countCell);
            fragment.appendChild(row);
          }
        }
        tableBody.appendChild(fragment);
      }
    });
  }
});