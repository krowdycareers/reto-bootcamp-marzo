console.log("Ejecutando el content script 2.0");

function filtradoCaracteristicasEmpleos() {
  //query selector jobcard
  const empleos = document.querySelectorAll("div[id*=jobcard-]");
  const arrayEmpleos = Array.from(empleos);
  const caracteristicasEmpleos = arrayEmpleos.map((empleo) => {
    let data = {
      recomendado: "Sin recomendacion",
    };
    data.url = empleo.querySelector("a[class*=jobcard-]").href;
    let caracteristicasEmpleo = empleo.children[1].children[0];
    let hijosEmpleoRecuperar =
      caracteristicasEmpleo.children[0].querySelectorAll("label");
    data.fecha = hijosEmpleoRecuperar[0].textContent;
    if (hijosEmpleoRecuperar.length >= 2) {
      data.recomendado = hijosEmpleoRecuperar[1].textContent;
    }
    data.titulo = caracteristicasEmpleo.children[1].textContent;
    data.sueldo = caracteristicasEmpleo.children[2].textContent;
    data.empresa =
      caracteristicasEmpleo.children[
        caracteristicasEmpleo.children.length - 2
      ].querySelector("label").textContent;
    data.lugar =
      caracteristicasEmpleo.children[
        caracteristicasEmpleo.children.length - 2
      ].querySelector("p").textContent;

    return data;
  });

  return caracteristicasEmpleos;
}

//Connect to background

const portBackground = chrome.runtime.connect({ name: "content-background" });
portBackground.postMessage({ message: "siguiente" });
portBackground.onMessage.addListener(async ({ message, final, totaljobs }) => {
  if (message === "nextpage") {
    const nextPageButton = document.querySelector("[class*=next-]");

    nextPageButton.click();
  }
  if (message == "sgtePagina") {
    const jobs = filtradoCaracteristicasEmpleos();
    portBackground.postMessage({ message: "jobs", jobs });
    let actual = document
      .querySelector("li[class*=active-]")
      .textContent.trim();
    let actual2 = parseInt(actual) + 1;
    actual2 = actual2.toString();
    console.log(actual2);
    let pagina = location.href;
    console.log(pagina.includes("?page="), "  page");
    let paginaFiltro = pagina.includes("?page=")
      ? pagina.slice(0, pagina.length - 1)
      : pagina + "?page=";
    let sgtepag = paginaFiltro + actual2;
    console.log(sgtepag);
    if (actual < final) {
      location.replace(sgtepag);
    }
    if (actual === final) {
      portBackground.postMessage({ message: "finalPaginacion" });
    }
  }
  
});

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function ({ message }) {
    if (message === "getJobs") {
      // port.postMessage({ message:"ok", data:jobs });
      // portBackground.postMessage({ message:"finish"});
      console.log("estas en getJobs");
      let pagFinal = Array.from(
        document.querySelector("ul[class*=pager-]").children
      );
      pagFinal = pagFinal[pagFinal.length - 2].textContent.trim();
      // let actual = document.querySelector("li[class*=active-]").textContent.trim()
      portBackground.postMessage({ message: "finish", pagFinal });
    }
  });
});
