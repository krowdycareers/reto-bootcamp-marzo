chrome.storage.local.get(["jobs"]).then((result) => {
  console.log(result.jobs);
  const divResult = document.getElementById("result");
  divResult.innerText =result.jobs.length;

  const downloadBtn = document.getElementById("downloadBtn");
  downloadBtn.innerText = "Descargar resultado en formato JSON";

  downloadBtn.addEventListener("click", () => {
    // Convierte el objeto result.jobs en una cadena JSON
    const jobsJson = JSON.stringify(result.jobs,null,2);

    // Crea un enlace de descarga con la cadena JSON como archivo
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute(
      "href",
      "data:text/json;charset=utf-8," + encodeURIComponent(jobsJson)
    );
    downloadLink.setAttribute("download", "jobs.json");

    // Hace clic en el enlace de descarga para descargar el archivo
    downloadLink.click();
  });
});
