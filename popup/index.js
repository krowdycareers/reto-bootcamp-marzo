/* Estas líneas de código están seleccionando elementos HTML del documento actual por su atributo ID y
asignándolos a variables constantes. */
const btnScripting = document.getElementById("btnPaginar");
const pMensaje = document.getElementById("mensajesEspera");
const btnResumen = document.getElementById("btnResumen");
const divDatos = document.getElementById("mensaje_datos");

/* Este código añade una escucha de eventos al botón "btnScripting" que espera un evento de clic.
Cuando se hace clic en el botón, se crea una conexión con el script de fondo mediante la API de ejecución de Chrome
y envía un mensaje con el mensaje "start" al script de fondo. También actualiza
el contenido de texto del elemento "pMensaje" para mostrar "Procesando..." en español.
español. */
btnScripting.addEventListener("click", async () => {
    const port = chrome.runtime.connect({name:"popup-background"})
    pMensaje.innerText="Procesando..."
    port.postMessage({message:"start"})
});

/* Este código añade un listener de eventos al botón "btnResumen" que escucha un evento de click. Cuando se pulsa el botón
botón se pulsa, se crea una conexión con el script de fondo utilizando la API de ejecución de Chrome
y envía un mensaje con el contenido "offline" al script de fondo. A continuación, espera un
mensaje de respuesta del script de fondo con el contenido "finish" y procesa los datos
recibidos en el mensaje de respuesta. Crea elementos HTML para mostrar los datos del trabajo recibidos en el
en un formato estructurado dentro del elemento "divDatos" del documento actual. */
btnResumen.addEventListener("click", async () => {

    /* Esta línea de código está creando una conexión entre la ventana emergente y el script de fondo de
    una extensión de Chrome usando el método `chrome.runtime.connect()`. Toma un objeto con la propiedad `name
    que se utiliza para identificar la conexión. La conexión resultante es
    se asigna a una variable constante `port`. */
    const port = chrome.runtime.connect({name:"popup-background"})
    /* `port.postMessage({message: "offline"})` está enviando un mensaje al script de fondo con el
    contenido `{message: "offline"}`. Este mensaje se utiliza para informar al script de fondo de que el
    usuario ha pulsado el botón "btnResumen" y desea recibir un resumen de los datos del trabajo en un
    formato offline. */
    port.postMessage({message:"offline"})

    /* Este código añade una escucha al objeto `port` para los mensajes entrantes. Cuando se recibe un
    mensaje, comprueba si la propiedad `message` del mensaje es igual a "finish". Si lo es
    borra el contenido de texto del elemento `pMensaje` y procesa la propiedad `data` del mensaje.
    del mensaje. */
    port.onMessage.addListener(({message,data}) => {
        if (message="finish") {
            pMensaje.innerText=""
            const jobData = JSON.parse(JSON.stringify(data, null, 2))
            
            /* Este código recorre un array de objetos de datos de trabajo (`jobData`) y crea elementos HTML
            para mostrar los datos en un formato estructurado. Para cada objeto de trabajo, extrae
            el país, los rangos salariales y las cantidades, y crea un elemento de encabezado para el país.
            país. A continuación, recorre las matrices de rangos salariales y cantidades para crear
            elementos de párrafo para cada rango salarial y su cantidad correspondiente. Estos elementos
            se añaden a un elemento div (`divContentSalario`) y luego se añaden a otro elemento div
            (`divContentPais`) que representa los datos del país. Por último, el elemento `divContentPais
            se añade al elemento `divDatos` del documento HTML para mostrar los datos del empleo. */
            for (const job of jobData) {
                const country = job.pais;
                const salaryRanges = job.rangoSalarial;
                const quantities = job.cantidad;
            
                // Create a heading element for the country
                const countryHeading = document.createElement("h6");
                countryHeading.classList.add("tipoLetra","titulo","mt-3")
                countryHeading.innerText = country;
            
                // Add the country heading to the data div
                divDatos.appendChild(countryHeading);
                const divContentPais = document.createElement("div")
                
                for (let i = 0; i < salaryRanges.length; i++) {
                    const divContentSalario = document.createElement("div")
                    divContentSalario.classList.add("d-flex","justify-content-between")
                    const salaryRange = salaryRanges[i];
                    const quantity = quantities[i];
                    
                    // Create a paragraph element for the salary range and its quantity
                    const Psalary = document.createElement("p");
                    Psalary.classList.add("fs-6","tipoLetra","parrafo")
                    Psalary.innerText = `${salaryRange}`;
                    const Pcantidad = document.createElement("p");
                    Pcantidad.classList.add("fs-6","tipoLetra","parrafo")
                    Pcantidad.innerText = `${quantity}`;
                    // Add the paragraph element to the data div
                    divContentSalario.appendChild(Psalary);
                    divContentSalario.appendChild(Pcantidad);
                    divContentPais.appendChild(divContentSalario);
                }
                divDatos.appendChild(divContentPais)
            }
        }
    });
});
