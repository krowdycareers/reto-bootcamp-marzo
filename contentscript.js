console.log("Ejecutando el content script 2.3");
/**
 * La función extrae información de empleo de una página web y la devuelve como un array de objetos.
 * @devuelve un array de objetos, donde cada objeto representa un listado de trabajo y contiene información
 * como la fecha, la empresa, el puesto, el rango salarial, los beneficios (si están disponibles), la ubicación y la URL.
 */
function getJobInformation() {
  const elemCardJobs = [...document.querySelectorAll('[id*="jobcard-"]')];
  const listJobs = elemCardJobs.map((cardJob) => {
    /* Crear un array a partir de los hijos del elemento con el id "jobcard-". */
    const auxAray = Array.from(cardJob.children[1].children[0].children);

    /* Comprobación de si el elemento tiene beneficios o no a travez de la longitud del auxArray. */
    const hasBenefit = auxAray.length == 7 ? true : false;

    /* A destructuring assignment. */
    if (hasBenefit) {
      const [
        { href: url },
        {
          children: [
            {
              children: [
                date,
                nameJob,
                rangeSalary,
                benefits,
                ,
                {
                  children: [
                    {
                      children: [
                        {
                          children: [
                            {
                              children: [
                                {
                                  children: [factory, location],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ] = cardJob.children;
      return {
        fecha: date.innerText,
        empresa: factory.innerText,
        puesto: nameJob.innerText,
        rangoSalarial: rangeSalary.innerText,
        beneficios: benefits.innerText,
        lugar: location.innerText,
        url,
      };
    } else {
      const [
        { href: url },
        {
          children: [
            {
              children: [
                date,
                nameJob,
                rangeSalary,
                ,
                {
                  children: [
                    {
                      children: [
                        {
                          children: [
                            {
                              children: [
                                {
                                  children: [factory, location],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ] = cardJob.children;
      return {
        fecha: date.innerText,
        empresa: factory.innerText,
        puesto: nameJob.innerText,
        rangoSalarial: rangeSalary.innerText,
        beneficios: "No se muestran",
        lugar: location.innerText,
        url,
      };
    }
  });
  return listJobs;
}

/**
 * La función filtra la información de los empleos para devolver un array de objetos que contiene el país y el rango salarial de cada empleo.
 * para cada trabajo.
 * Devuelve un array de objetos con dos propiedades: "pais" (país) y "salario" (rango salarial),
 * que se extraen de la información del puesto obtenida de la función `getJobInformation()`.
 */
function getCountrySalaryData(){
  const allJobs = getJobInformation();
  const dataCountrySalaryFilter = allJobs.map((item)=>{
    return ({"pais":item.lugar ,"salario":item.rangoSalarial})
  });
  return dataCountrySalaryFilter;
}

/**
 * La función cuenta el número de puestos de trabajo y su rango salarial por país.
 * @returns La función `countJobSalary()` devuelve un objeto `dataFiltrado` que contiene
 * información sobre el número de puestos de trabajo, rango salarial y país para cada puesto de trabajo. El objeto
 * objeto se crea reduciendo el array `dataCountrySalaryFilter` y agrupando los puestos de trabajo por
 * país, contando el número de puestos y calculando el rango salarial de cada país.
 * país.
 */
function countJobSalary(){
  const dataCountrySalaryFilter = getCountrySalaryData();
  const dataFiltrado = dataCountrySalaryFilter.reduce((accumulator, current) => {
    // Si ya existe un objeto con el mismo "pais" en el acumulador, incrementamos su "cantidad"
    if (accumulator[current.pais]) {
      accumulator[current.pais].cantidad++;
    } else {
      // Si no existe, creamos un nuevo objeto en el acumulador
      accumulator[current.pais] = {
        pais: current.pais,
        rangoSalarial: current.salario,
        cantidad: 1
      };
    }
    return accumulator;
  }, {});
  return dataFiltrado;
}

/**
 * La función convierte un objeto en un array utilizando el método Object.values().
 * @returns La función `convertObjectToArray` devuelve un array que contiene los valores del
 * objeto devuelto por la función `countJobSalary`.
 */
function convertObjectToArray(){
  const dataFiltrado = Object.values(countJobSalary())
  return dataFiltrado
}

/**
 * La función agrupa los datos por país, combinando el rango salarial y los datos de cantidad en matrices para cada
 * país.
 * Devuelve un array de objetos donde cada objeto representa un país y contiene el nombre del país,
 * un array de rangos salariales, y un array de cantidades correspondientes.
 */
function groupDataCountry(){
  const data = convertObjectToArray()
  const groupedData = data.reduce((acc, curr) => {
    if (acc[curr.pais]) {
      acc[curr.pais].rangoSalarial.push(curr.rangoSalarial);
      acc[curr.pais].cantidad.push(curr.cantidad);
    } else {
      acc[curr.pais] = {
        pais: curr.pais,
        rangoSalarial: [curr.rangoSalarial],
        cantidad: [curr.cantidad]
      };
    }
    return acc;
  }, {});
  
  const result = Object.values(groupedData);
  return result
}


/**
 * The function clicks the next button on a webpage.
 */
function clickNextButton(){
    const nextPageButton = document.querySelector("[class*=next-]");
    nextPageButton.click();
}

//Connect to background
const portBackground = chrome.runtime.connect({ name: "content-background" });

portBackground.postMessage({message: "online"})
/* Este código está a la escucha de los mensajes del script de fondo. Cuando se recibe un mensaje con el contenido
"scrap", llama a la función `groupDataCountry()` para extraer la información del trabajo de la
de la página web actual, registra el resultado en la consola y pulsa el botón "siguiente" para pasar a la página
siguiente página de ofertas de empleo. */
portBackground.onMessage.addListener(async ({ message}) => {
    /* Este bloque de código está a la escucha de un mensaje del script de fondo. Si el mensaje recibido
    es "scrap", llama a la función `groupDataCountry()` para extraer información de trabajo de la página web actual, registra el resultado en la consola y pulsa el botón "next" para pasar a la página siguiente.
    página web actual, registra el resultado en la consola y pulsa el botón "siguiente" para pasar a la página
    siguiente página de ofertas de empleo. */
    if (message === "scrap") {
        const job = groupDataCountry()
        console.log(job)
        clickNextButton()
    }
});

chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(function ({ message }) {
        /* Este bloque de código está a la escucha de un mensaje del script de fondo. Si el mensaje
        recibido es "scrap", llama a la función `groupDataCountry()` para extraer información de trabajo
        de la página web actual, registra el resultado en la consola y pulsa el botón "siguiente" para pasar a la página
        pasar a la siguiente página de ofertas de empleo. A continuación, envía un mensaje al script en segundo plano
        con los datos extraídos de la página web y un mensaje de "siguiente" si se encontró el botón "siguiente", o un mensaje vacío si no se encontró.
        o un mensaje vacío si no se encontró. */
        if (message === "scrap") {
            const job = groupDataCountry()
            console.log(job)
            const nextPageButton = document.querySelector("[class*=next-]");
            const message = !!nextPageButton?"next":""
            portBackground.postMessage({message,data:job})
        }
    });
});