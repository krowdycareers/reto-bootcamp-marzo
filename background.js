function resumeInformationJobs(data) {
  let cities = [...new Set(data.map((item) => item.ciudad))].map((ciudad) => ({
    ciudad,
    resume: [],
  }));

  cities.forEach((city) => {
    let allSalariesByCity = data.filter((item) => item.ciudad == city.ciudad);

    let salaries = [
      ...new Set(allSalariesByCity.map((item) => item.salario)),
    ].map((item) => ({ salario: item, count: 0 }));

    salaries.forEach((salary) => {
      let listSalaries = allSalariesByCity.filter(
        (item) => item.salario == salary.salario
      );
      salary.count = listSalaries.length;
    });

    city.resume = [...salaries];
  });
  return cities;
}

let listAllJobs = [];

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async function ({ message, data }) {
    if (message === "startscrap") {
      listAllJobs = [];
      port.postMessage({ message: "repeat" });
    }
    if (message === "next") {
      listAllJobs = listAllJobs.concat(data);
      port.postMessage({ message: "repeat" });
    }
    if (message === "finish") {
      listAllJobs = listAllJobs.concat(data);
      port.postMessage({
        message: "resume",
        data: resumeInformationJobs(listAllJobs),
      });
    }
  });
});
