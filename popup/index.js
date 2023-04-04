const btnScripting = document.getElementById("btncomunicacion");
const btnScriptingBackground = document.getElementById("btncomunicacionbckg");
const pMensaje = document.getElementById("mensajes");
const loader = document.getElementById("loader");

const FiltroLugar = (arrayTrabajos, filtro) => {
  let cantidad = {};

  arrayTrabajos.forEach((trabajo) => {
    if (cantidad[trabajo[filtro]]) {
      cantidad[trabajo[filtro]].cantidad++;
      cantidad[trabajo[filtro]].trabajos.push(trabajo);
    } else {
      cantidad[trabajo[filtro]] = {
        cantidad: 1,
        trabajos: [trabajo],
      };
    }
  });
  return cantidad;
};

const DibujadoDeDatos = ({ ciudadesFiltro, sueldoPorCiudad }) => {
  const fragment = document.createDocumentFragment();
  const datosEmpleos = document.querySelector(".datosEmpleos");

  sueldoPorCiudad.forEach((ciudad, index) => {
    const itemList = document.createElement("li");

    const itemchildCiudad = document.createElement("p");
    itemchildCiudad.textContent = ciudadesFiltro[index];
    const itemchildListaPrecios = document.createElement("ul");

    for (const sueldo in ciudad) {
      const itemPrecioCiudad = document.createElement("li");
      const itemPrecioCiudadDatos = document.createElement("div");

      itemPrecioCiudadDatos.classList.add("sueldo");
      const itemSueldo = document.createElement("p");
      itemSueldo.textContent = sueldo;
      const itemCantidad = document.createElement("p");
      itemCantidad.textContent = ciudad[sueldo].cantidad;
      const itemTrabajosSueldo = ciudad[sueldo].trabajos;
      itemPrecioCiudadDatos.appendChild(itemSueldo);
      itemPrecioCiudadDatos.appendChild(itemCantidad);

      const itemListaTrabajosPorSueldo = document.createElement('ul');
      itemTrabajosSueldo.forEach(trabajo => {
        const itemTrabajoLista = document.createElement('li')
        const itemTrabajoListaDireccion = document.createElement('a')
        itemTrabajoListaDireccion.textContent = trabajo.titulo;
        itemTrabajoListaDireccion.href = trabajo.url;

        itemTrabajoLista.appendChild(itemTrabajoListaDireccion);
        itemListaTrabajosPorSueldo.appendChild(itemTrabajoLista);
      });
      
      itemPrecioCiudad.appendChild(itemPrecioCiudadDatos);
      itemPrecioCiudad.appendChild(itemListaTrabajosPorSueldo);
      
      itemchildListaPrecios.appendChild(itemPrecioCiudad);
    }

    itemList.appendChild(itemchildCiudad);
    itemList.appendChild(itemchildListaPrecios);
    fragment.appendChild(itemList);
  });
  datosEmpleos.appendChild(fragment);
};

const AdquisicionDatos = async () => {
  let datos = await chrome.storage.local.get(["trabajos"]);
  let lugares = FiltroLugar(datos.trabajos, "lugar");
  let ciudades = Object.keys(lugares);
  let sueldoPorCiudad = [];
  ciudades.forEach((ciudad) => {
    const trabajoPorCiudad = lugares[ciudad].trabajos;
    sueldoPorCiudad.push(FiltroLugar(trabajoPorCiudad, "sueldo"));
  });

  let ciudadesFiltro = ciudades.map((value) => {
    if (value === "") {
      return "No especifica Lugar";
    } else {
      return value;
    }
  });

  // console.log(lugares);
  // console.log(ciudadesFiltro);
  // console.log(sueldoPorCiudad);
  // ciudadesFiltro.forEach((valor, index) => {
  //   sueldoPorCiudad[index].ciudad = valor;
  // });
  console.log(sueldoPorCiudad);
  DibujadoDeDatos({ ciudadesFiltro, sueldoPorCiudad });
};

btnScripting.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let port = chrome.tabs.connect(tab.id, { name: "popup" });
  loader.classList.remove("loader-off");
  port.postMessage({ message: "getJobs" });
});

// var port = chrome.runtime.connect({ name: "popup-background" });
// port.postMessage({ message: "Hola BD" });
// port.onMessage.addListener(function ({ message}) {
//   if (message === "finalizacionPaginar"){
//     console.log("Termine de paginar");
//   }
// });
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg === "termine") {
    //  To do something
    // const loader = document.getElementById("loader");
    loader.classList.add("loader-off");
    AdquisicionDatos();
  }
});

btnScriptingBackground.addEventListener("click", () => {
  AdquisicionDatos();
});
