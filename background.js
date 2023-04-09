
let statusScrap = 'stop'
let jobsFiltrados = []

/**
 * La función guarda los datos añadiendo nuevos datos o actualizando los existentes en un array llamado
 * jobsFiltrados.
 * @param datos - El parámetro datos es un array de objetos que contiene información de los trabajos como país,
 * rango salarial, y cantidad.
 */
function saveData(data){
    /* Este bloque de código comprueba si el array `jobsFiltrados` está vacío. Si lo está, añade todos los elementos
    del array `data` al array `jobsFiltrados` usando un bucle for. */
    if(jobsFiltrados.length===0){
        for(var i=0; i<data.length;i++){
            jobsFiltrados.push(data[i])
        }
    }
    /* Este bloque de código se ejecuta cuando el array `jobsFiltrados` no está vacío. Recorre
    cada objeto del array `data` y comprueba si hay un objeto coincidente en el array `jobsFiltrados
    basándose en las propiedades `pais` y `rangoSalarial`. Si se encuentra una coincidencia, actualiza la propiedad
    del objeto coincidente. Si no hay ninguna coincidencia basada en `rangoSalarial`, se
    añade un nuevo `rangoSalarial` y `cantidad` al objeto coincidente. Si no hay coincidencias basadas en
    `pais`, añade el objeto completo al array `jobsFiltrados`. */
    else{
        for (let i = 0; i < data.length; i++) {
            let found = false;
            for (let j = 0; j < jobsFiltrados.length; j++) {
                if (data[i].pais === jobsFiltrados[j].pais && data[i].rangoSalarial.toString() === jobsFiltrados[j].rangoSalarial.toString()) {
                    jobsFiltrados[j].cantidad[0] += data[i].cantidad[0];
                    found = true;
                    break;
                } else if (data[i].pais === jobsFiltrados[j].pais) {
                    jobsFiltrados[j].rangoSalarial.push(data[i].rangoSalarial[0]);
                    jobsFiltrados[j].cantidad.push(data[i].cantidad[0]);
                    found = true;
                    break;
                }
            }
            if (!found) {
                jobsFiltrados.push(data[i]);
            }
        }
    }
    
}


/**
 * Esta función extrae la cadena de consulta de una URL y la convierte en un objeto usando
 * URLSearchParams.
 * @returns La función `getUrl()` devuelve un objeto de tipo `URLSearchParams` que contiene los
 * parámetros de consulta de la URL.
 */
function getUrl(sender){
    const url = sender.sender.url
    return new URLSearchParams(url.split("?")[1]); // Obtener la cadena de consulta y convertirla en un objeto URLSearchParams
}

/**
 * Esta función recupera el valor del parámetro "page" de la URL actual.
 * @returns La función `getPage()` devuelve el valor del parámetro "page" de la URL.
 */
function getPage(sender){
    const params = getUrl(sender)
    return params.get("page");
}

/* Este código añade un listener al objeto `chrome.runtime` que escucha conexiones desde
otras partes de la extensión. Cuando se establece una conexión, la función dentro del oyente se ejecuta.
se ejecuta. */
chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(async function ({ message,data },sender,sendResponse) {

        /* Este bloque de código comprueba si el mensaje recibido de la extensión es "start". Si lo es,
        consulta la pestaña activa en la ventana actual usando `chrome.tabs.query()`, establece la variable
        `statusScrap` a "start", establece una conexión con la pestaña usando
        `chrome.tabs.connect()`, y envía un mensaje a la pestaña con el mensaje "scrap" utilizando
        port.postMessage()`. */
        if (message === "start") {
            const [tab] = await chrome.tabs.query({
                active: true,
                currentWindow: true,
            });
            if(!tab) return;
            statusScrap = "start"
            let port = chrome.tabs.connect(tab.id, { name: "background-content" });
            port.postMessage({ message: "scrap" });
            return;
        }

        
        /* Este bloque de código gestiona el mensaje "next" recibido de la extensión. Primero llama a la función
        la función `getPage(sender)` para obtener el número de página actual de la URL de la pestaña
        del remitente. A continuación, registra los "datos" recibidos del remitente. A continuación, llama a la función
        `saveData(data)` para guardar los datos recibidos en el array `jobsFiltrados`. */
        if (message === "next") {
            const page = getPage(sender);
            console.log(data)
            saveData(data)
            console.log(sender);
            /* Este bloque de código comprueba si la variable `page` es `undefined` o `null`. Si lo es
            significa que la URL actual de la pestaña no tiene un parámetro `page` en la cadena de consulta,
            lo que indica que la página actual es la primera página del listado de empleos. En
            caso, el código actualiza la URL de la pestaña a la segunda página de las ofertas de empleo
            (`https://www.occ.com.mx/empleos/en-ciudad-de-mexico/?page=2`) utilizando
            chrome.tabs.update()`. La sentencia `return` se utiliza para salir de la función y evitar
            la ejecución del código. */
            if(page === undefined || page === null) {
                await chrome.tabs.update(sender.sender.tab.id,{url:"https://www.occ.com.mx/empleos/en-ciudad-de-mexico/?page=2",});
                return;
            }/* Este bloque de código se ejecuta cuando el mensaje recibido de la extensión es "next". En
            primero llama a la función `getPage(sender)` para obtener el número de página actual de la URL
            de la pestaña del remitente. A continuación, guarda los "datos" recibidos del remitente. A continuación, llama a
            la función `saveData(data)` para guardar los datos recibidos en el array `jobsFiltrados`. */
            else{
                await chrome.tabs.update(sender.sender.tab.id,{url:"https://www.occ.com.mx/empleos/en-ciudad-de-mexico/?page="+(parseInt(page)+1),});
                return;
            }
        }

        /* Este bloque de código comprueba si el mensaje recibido de la extensión es "online" y si la variable
        `statusScrap` tiene el valor "start". Si ambas condiciones son verdaderas, envía un mensaje a
        al script de contenido para que continúe con el raspado de datos. Esto es útil en caso de que el proceso de scraping
        se interrumpió debido a un problema de red o de otro tipo, y la extensión tiene que reanudar
        desde donde lo dejó. */
        if (message === "online" && statusScrap === "start") {
            port.postMessage({ message: "scrap" });
            return;
        }

        /* Este bloque de código comprueba si el mensaje recibido de la extensión es "offline". Si lo es
        el valor de la variable `statusScrap` a "finish", envía un mensaje al script de
        script de contenido con el mensaje "finalizar" y los datos almacenados en el array `jobsFiltrados`,
        establece el array `jobsFiltrados` a un array vacío, y retorna. Este bloque de código se ejecuta
        cuando el proceso de scraping se completa y la extensión necesita ser notificada con los resultados finales.
        finales. */
        if(message === "offline"){
            statusScrap="finish"
            port.postMessage({message:"finish",data:jobsFiltrados});
            jobsFiltrados= []
            return
        }

    });
});


