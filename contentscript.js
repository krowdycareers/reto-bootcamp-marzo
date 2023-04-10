function getJobInformation() {
  
    
    let jobCardContent = [...document.querySelectorAll("[id*='jobcard-']")];
    let jobsInfo = jobCardContent.map((jobInfo) => {

      let title = jobInfo.querySelector("h2").innerText;
      let rangoSalarial = jobInfo.querySelector("[class*='salary-']").innerText;
      let citiesElement = jobInfo.querySelector("[class*='zonesLinks-']");
    

      let jobCitiesArr = [].slice.call(citiesElement.children).map(location => location.innerText);

      let validateCity = jobCitiesArr.length === 0? ['no especificada']: jobCitiesArr;

      return {titulo: title, rangoSalarial: rangoSalarial, cities: validateCity};
    });

    let arrayCitiesGeneral = jobsInfo.map( job => job.cities);
    let arrayCitiesFinal = arrayCitiesGeneral.flat().reduce((acc, el1) => {
        if(!acc.some(el2 => el2 == el1)) acc.push(el1);
        return acc;
    }, []);

    let cityAndSalaryGrouping = arrayCitiesFinal.map(city => {
      let jobfilteredByCity = jobsInfo.filter(job => job.cities.some(el => el== city));

      let rangeSalarys = jobfilteredByCity.reduce((ranges, job) => {
        if(!ranges.some(el => el== job.rangoSalarial)) ranges.push(job.rangoSalarial);
        return ranges;
      }, [])

      let rangeSalaryGrouping = rangeSalarys.map(rangeSalary => {
        jobsFilteredByRangeSalary = jobfilteredByCity.filter(job => job.rangoSalarial == rangeSalary);
        let conteo = jobsFilteredByRangeSalary.length;
        return {rangoSalarial: rangeSalary, cantidad: conteo}
      })

      return {city, quantity: jobfilteredByCity.length, rangeSalaryGrouping}
    })


  
    return cityAndSalaryGrouping;
}

console.log("ejecutando content 3")

// connect to background
const portBackground = chrome.runtime.connect({name :  "content-background"});

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  })
}

portBackground.postMessage({message: "online"});
portBackground.onMessage.addListener(async ({message}) => {
  if( message == "scrap"){
    wait(3000);
    const jobs = getJobInformation();    
    const nextPageButton = document.querySelector('[class*=next-]');
    const disabled = nextPageButton?.classList.contains('disabled-0-2-601')
    const message = !!nextPageButton && !disabled? "next": "stop";
    portBackground.postMessage({message, data:jobs});
  }
})

chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(function ({message, data}) {
        console.log(message);
        console.log(data);
        if(message == 'scrap') {
            const jobs = getJobInformation();
            const nextPageButton = document.querySelector('[class*=next-]');
            const disabled = nextPageButton.classList.contains('disabled-0-2-601')
            const message = !!nextPageButton && !disabled? "next": "stop";
            portBackground.postMessage({message, data:jobs});
        }
        if(message == 'finished' && data !== null){
          console.log(data);
        }
    });
});



