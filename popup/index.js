const btnScripting = document.getElementById("btnScrap");
const btnStop = document.getElementById("btnStop");
const btnClear = document.getElementById("btnClear");
const pMessage = document.getElementById("message");
const tResults = document.getElementById("tableResults");

function displayGroupedJobs(groupedJobs) {
  // Crea una tabla vacía
  const table = document.createElement("table");

  // Crea la fila del encabezado
  const thead = table.createTHead();
  const headerRow = thead.insertRow();
  const cityHeader = headerRow.insertCell();
  cityHeader.textContent = "City";
  const countHeader = headerRow.insertCell();
  countHeader.textContent = "Count Jobs";
  const minSalaryHeader = headerRow.insertCell();
  minSalaryHeader.textContent = "Min Salary";
  const maxSalaryHeader = headerRow.insertCell();
  maxSalaryHeader.textContent = "Max Salary";

  // Agrega una fila por cada ciudad
  const tbody = table.createTBody();
  if (groupedJobs.length === 0) {
    const row = tbody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 4;
    cell.textContent = "Data not found";
  } else {
    for (const group of groupedJobs) {
      const row = tbody.insertRow();
      const cityCell = row.insertCell();
      cityCell.textContent = group.city;
      const countCell = row.insertCell();
      countCell.textContent = group.count;
      const minSalaryCell = row.insertCell();
      minSalaryCell.textContent = group.minSalary
        ? `$${group.minSalary}`
        : "Not available";
      const maxSalaryCell = row.insertCell();
      maxSalaryCell.textContent = group.maxSalary
        ? `$${group.maxSalary}`
        : "Not available";
    }
  }

  // Agrega la tabla al contenido del popup
  const content = document.createElement("div");
  content.appendChild(table);
  return content.innerHTML;
}

const port = chrome.runtime.connect({ name: "popup-background" });

btnScripting.addEventListener("click", async () => {
  port.postMessage({ message: "start" });
  pMessage.innerText = "Scraping...";
  chrome.runtime.onMessage.addListener(async function (
    { message, data },
    _sender,
    _sendResponse
  ) {
    if (message === "ok") {
      pMessage.innerText = "";
      tResults.innerHTML = displayGroupedJobs(data);
    }
  });
});
btnStop.addEventListener("click", async () => {
  port.postMessage({ message: "finish" });
  chrome.runtime.onMessage.addListener(async function (
    { message, data },
    _sender,
    _sendResponse
  ) {
    if (message === "ok") {
      pMessage.innerText = "";
      tResults.innerHTML = displayGroupedJobs(data);
    }
  });
});

btnClear.addEventListener("click", async () => {
  await chrome.storage.local.clear();
  tResults.innerHTML = "";
});
