const button = document.querySelectorAll('[class^="pagerBlock"]');

button[0].addEventListener("click", () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const page = urlParams.get("page");
  window.location.search = `?page=${parseInt(page) + 1}`;
});

//Extraigo todo el div del jobs
const jobCards = document.querySelectorAll('div[id^="jobcard"]');

const jobs = Array.from(jobCards).map((card) => {
  const title = card.querySelector(
    ".text-0-2-82.subheading-0-2-86.highEmphasis-0-2-103.job-0-2-557.longWord-0-2-576"
  ).textContent;
  const salary = card.querySelector("span[class*=salary]").textContent;
  const city = card.querySelector("p[class*=zonesLinks]").textContent;

  return { title, salary, city };
});


chrome.storage.local.get(["jobs"], (result) => {
  let storedJobs = result.jobs || [];
  const newJobs = jobs.filter(job => !storedJobs.some(storedJob => job.title === storedJob.title));
  if (newJobs.length === 0) {
    console.log("No se encontraron nuevos trabajos para agregar a storedJobs");
    console.log(storedJobs);
    return;
  }
  storedJobs = [...storedJobs, ...newJobs];
  chrome.storage.local.set({ jobs: storedJobs }, () => {
    console.log("Información almacenada correctamente en chrome.storage.local");
    console.log(storedJobs);
  });
});
