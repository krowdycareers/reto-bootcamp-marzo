const btnStart = document.getElementById("btnstart");
const btnClear = document.getElementById("btnclear");
const pLoading = document.getElementById("loading");
const divContainer = document.getElementById("container");

const getAttributeAsArray = (jobs, attribute) => {
  return [...new Set(jobs.map((job) => job[attribute]))];
};

const jobsGrouper = (jobs) => {
  const cities = getAttributeAsArray(jobs, "city");
  return cities.map((city) => {
    const jobsMatchCity = jobs.filter((job) => job.city === city);

    const salaries = getAttributeAsArray(jobsMatchCity, "salary");

    const jobsBySalary = salaries.map((salary) => {
      const jobsCount = jobsMatchCity.filter(
        (job) => job.salary === salary
      ).length;
      return {
        salary,
        jobsCount,
      };
    });

    return {
      city,
      jobsBySalary,
    };
  });
};

const renderStats = (stats = []) => {
  let html = ``;
  stats.forEach((stat) => {
    html = html.concat(`
      <table>
        <thead>
          <tr>
            <th>Ciudad</th>
            <th>Salario</th>
            <th>Cantidad de trabajos</th>
          </tr>
        </thead>
        <tbody>
    `);
    stat.jobsBySalary.forEach((item, i) => {
      html = html.concat(`<tr>`);
      if (i === 0) {
        html = html.concat(`<td rowspan="${stat.jobsBySalary.length}">${stat.city}</td>`);
      }
      html = html.concat(`
          <td>${item.salary}</td>
          <td>${item.jobsCount}</td>
        </tr>
      `);
    });
    html = html.concat(`
    </tbody>
      </table>
    `);
  });
  divContainer.innerHTML = html;
};

btnStart.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let port = chrome.tabs.connect(tab.id, { name: "popup" });
  port.postMessage({ message: "start" });
  pLoading.innerText = "Procesando...";
  port.onMessage.addListener(({ message, data }) => {
    // if (message === "ok") pLoading.innerText = JSON.stringify(data, null, 2);
    if (message === "ok") {
      pLoading.innerText = "";
      const stats = jobsGrouper(data.jobs);
      // pLoading.innerText = JSON.stringify(stats, null, 2);
      renderStats(stats);
    }
  });
});

btnClear.addEventListener("click", async () => {
  pLoading.innerText = "Limpiando...";
  await chrome.storage.local.clear(function () {
    pLoading.innerText = "Limpieza completada";
  });
});
