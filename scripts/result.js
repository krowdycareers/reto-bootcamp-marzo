chrome.storage.local.get(["jobs"]).then((result) => {
  // Obtener la tabla HTML del documento
  const table = document.getElementById("jobTable");
  // Definir un objeto vacío para almacenar las métricas
  let metrics = {};
  // Iterar a través de cada objeto en la matriz
  for (let i = 0; i < result.jobs.length; i++) {
    const job = result.jobs[i];
    if (!job.city || job.salary === "Sueldo no mostrado por la empresa") {
      continue;
    }
    // Extraer la ciudad y el rango salarial del objeto actual
    const city = job.city;
    const salaryRange = job.salary;
    // Si la ciudad aún no está en las métricas, agregarla con un objeto vacío para almacenar las métricas de salarios
    if (!metrics[city]) {
      metrics[city] = {
        totalJobs: 0,
      };
    }
    // Si el rango salarial no se especifica, omitirlo y continuar con el siguiente trabajo
    if (salaryRange === "Sueldo no mostrado por la empresa") {
      continue;
    }
    // Extraer los valores mínimo y máximo del rango salarial
    const [minSalary, maxSalary] = salaryRange.split(" - ");
    const min = parseInt(minSalary?.replace("$", "").replace(",", ""));
    const max = parseInt(maxSalary?.replace("$", "").replace(",", ""));
    console.log(minSalary, maxSalary);

    // Incrementar el recuento de trabajos en la ciudad correspondiente
    metrics[city].totalJobs++;
  }

  // FUNCIONES
  function getMinSalary(city, jobs) {
    let minSalary = Infinity;
    let secondMinSalary = Infinity;
    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      if (
        job.city === city &&
        job.salary !== "Sueldo no mostrado por la empresa"
      ) {
        const [min, max] = job.salary
          .split(" - ")
          .map((s) => parseInt(s.replace("$", "").replace(",", "")));
        if (!isNaN(min)) {
          if (min < minSalary) {
            secondMinSalary = minSalary;
            minSalary = min;
          } else if (min < secondMinSalary) {
            secondMinSalary = min;
          }
        }
      }
    }
    return minSalary === Infinity ? "" : `$${minSalary.toLocaleString()}`;
  }

  function getMaxSalary(city, jobs) {
    let maxSalary = -Infinity;
    let secondMaxSalary = -Infinity;
    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      if (
        job.city === city &&
        job.salary !== "Sueldo no mostrado por la empresa"
      ) {
        const [min, max] = job.salary
          .split(" - ")
          .map((s) => parseInt(s.replace("$", "").replace(",", "")));
        if (!isNaN(max)) {
          if (max > maxSalary) {
            secondMaxSalary = maxSalary;
            maxSalary = max;
          } else if (max > secondMaxSalary) {
            secondMaxSalary = max;
          }
        }
      }
    }
    return maxSalary === -Infinity ? "" : `$${maxSalary.toLocaleString()}`;
  }

  // Crear una fila de encabezado para la celda de la ciudad y la de empleos
  const headerRow = document.createElement("tr");

  const cityHeader = document.createElement("th");
  cityHeader.textContent = "Ciudad";
  headerRow.appendChild(cityHeader);

  const jobCountHeader = document.createElement("th");
  jobCountHeader.textContent = "Empleos encontrados";
  headerRow.appendChild(jobCountHeader);

  const minSalaryHeader = document.createElement("th");
  minSalaryHeader.textContent = "Salario minimo";
  headerRow.appendChild(minSalaryHeader);

  const maxSalaryHeader = document.createElement("th");
  maxSalaryHeader.textContent = "Salario maximo";
  headerRow.appendChild(maxSalaryHeader);

  table.appendChild(headerRow);

  // Iterar a través de cada ciudad en las métricas
  for (const city in metrics) {
    // Crear una fila de tabla para la ciudad actual
    const cityRow = document.createElement("tr");

    // Crear una celda de tabla para el nombre de la ciudad
    const cityCell = document.createElement("td");
    cityCell.textContent = city;
    cityRow.appendChild(cityCell);

    // Crear una celda de tabla para el número de trabajos encontrados en la ciudad actual
    const jobCountCell = document.createElement("td");
    jobCountCell.textContent = metrics[city].totalJobs;
    cityRow.appendChild(jobCountCell);

    // Crear una celda de tabla para el salario mínimo en la ciudad actual
    const minSalaryCell = document.createElement("td");
    minSalaryCell.textContent = getMinSalary(city, result.jobs);
    cityRow.appendChild(minSalaryCell);

    // Crear una celda de tabla para el salario máximo en la ciudad actual
    const maxSalaryCell = document.createElement("td");
    maxSalaryCell.textContent = getMaxSalary(city, result.jobs);
    cityRow.appendChild(maxSalaryCell);

    // Agregar la fila de tabla completa a la tabla HTML
    table.appendChild(cityRow);
  }
});
