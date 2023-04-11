const btnScripting = document.getElementById("btnpaginar");

const btnObtener = document.getElementById("btnobtener");

btnScripting.addEventListener("click", async () => {
 const port = chrome.runtime.connect({name:"popup-background"});
 port.postMessage({message:"start"});
});

btnObtener.addEventListener("click", async () => {
  const port = chrome.runtime.connect({name:"popup-background"});
  port.postMessage({message:"finish"});
  port.onMessage.addListener(({message,data})=>{
    if(message==="finish"){
      const o = dataProcess(data);
      o.forEach(el=>{
        document.getElementById('detalle').insertRow(-1).innerHTML='<tr><td>'+el.ciudad+'</td><td>'+el.numero+'</td></tr>';
       
      })
    }
  });
 });

function dataProcess(data){
  let trabajosSalarios = [];
  let ciudades=[];
  data.forEach(element=>{
    if(element.salario!=="Sueldo no mostrado por la empresa"){
      trabajosSalarios.push(element);
    }
  })
  trabajosCiudades= trabajosSalarios.map((job)=>job.ciudad);
  trabajosCiudades.forEach(ele=>{
    ele.forEach(ele1=>{
      ciudades.push(ele1);
    })
  })
  let cities = ciudades.filter((item,index)=>{
    return ciudades.indexOf(item) === index;
  })
  cities = cities.map((j)=>{
    return {ciudad:j, numero:0}
  });
  trabajosSalarios.forEach(ele=>{
    ele.ciudad.forEach(ele1=>{
      cities.forEach(ele2=>{
        if(ele1 === ele2.ciudad){
          ele2.numero = ele2.numero+1;
        }
      })
    })
  })
  return cities;
}

/*
btnScriptingBackground.addEventListener("click", async () => {
  var port = chrome.runtime.connect({ name: "popup-background" });
  port.postMessage({ message: "Hola BD" });
  port.onMessage.addListener(function ({ message }) {
    alert(message);
  });
});
*/

