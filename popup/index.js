const btnScripting = document.getElementById("btncomunicacion");
const loadingSpinner = document.getElementById("loading");
const elementResume = document.getElementById("listResume");
const date = document.getElementById("today");

date.innerText = todayDate();

btnScripting.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let port = chrome.tabs.connect(tab.id, { name: "popup" });

  port.postMessage({ message: "getJobs" });
  loadingSpinner.classList.remove("d-none");
  port.onMessage.addListener(({ message, data }) => {
    if (message == "end") {
      loadingSpinner.classList.add("d-none");
      elementResume.innerHTML = loadResumeDatainHtml(data);
    }
  });
});

function loadResumeDatainHtml(data) {
  let strHtml = "";
  data.forEach((item) => {
    strHtml += '<li class="list-group-item py-3">';
    strHtml += `<span class="fw-bold">${item.ciudad}</span>
      <ul class="list-resume p-0">`;
    item.resume.forEach((el) => {
      strHtml += `
        <li>
          <img src="./../images/checkbox.png" alt="" width="16" />
          <span class="mx-1">${el.salario.replace(" Mensual", "")}</span>
          <span class="badge bg-danger">${el.count}</span>
        </li>
      `;
    });
    strHtml += `</ul></li>`;
  });
  return strHtml;
}

function todayDate() {
  const meses = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  const fechaActual = new Date();
  const dia = fechaActual.getDate();
  const mes = meses[fechaActual.getMonth()];
  return `${dia} ${mes}`;
}
