const portBackground = chrome.runtime.connect({ name: "content-background" });

console.log("Ejecutandose el content script 1.0");

function getJobInformation() {
  const jobs = Array.from(document.querySelectorAll("[id*='jobcard-']"));
  const getJobs = jobs.map((job) => {
    const [
      { href: link },
      {
        children: [
          {
            children: [
              { innerText: date },
              { innerText: title },
              { innerText: salary },
              { innerText: beneficios },
              {
                children: [elementEnterpriseCity],
              },
            ] = null,
          } = {},
        ] = null,
      },
    ] = job.children;

    const enterprise = elementEnterpriseCity?.querySelector("label")?.innerText;
    const city = elementEnterpriseCity?.querySelector("p")?.innerText;

    return {
      link,
      date,
      title,
      salary,
      beneficios,
      enterprise,
      city,
    };
  });
  return getJobs;
}

function filterJobs(jobs) {
  const JobsFilterBySalary = jobs.filter((job) =>
    job.salary.includes("$15,000 - $20,000")
  );
  let jobsFilters = {};
  JobsFilterBySalary.forEach((job) => {
    if (job.city in jobsFilters) {
      jobsFilters[job.city]["quantity"] += 1;
    } else {
      jobsFilters[job.city] = {
        city: job.city,
        quantity: 1,
      };
    }
  });
  return jobsFilters;
}

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(({ message }) => {
    if (message === "getJobs") {
      const jobs = getJobInformation();
      const jobsFilter = filterJobs(jobs);
      port.postMessage({ message: "ok", data: jobsFilter });
      portBackground.postMessage({ message: "finish", data: jobsFilter });
    }
  });
});

//Connetc to background
portBackground.onMessage.addListener(async ({ message }) => {
  if (message == "nextpage") {
    const nextPageBoton = document.querySelector("[class*=next-]");
    nextPageBoton.click();
  }
});
