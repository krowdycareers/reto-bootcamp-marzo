const btnScripting = document.getElementById('btnPaginar')
const lblMessage = document.getElementById('loading')
const ulList = document.getElementById('list')
const btnTerminar = document.getElementById('btnTerminar')

btnScripting.addEventListener('click', async () => {
  const port = chrome.runtime.connect({ name: 'popup-background' })
  lblMessage.style.display = 'block'
  port.postMessage({ message: 'start' })

  port.onMessage.addListener(({ message }) => {
    message === 'error' &&
      (lblMessage.innerText = 'Error al iniciar el scraping')
  })
})

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const port = chrome.runtime.connect({ name: 'popup-background' })
    port.postMessage({ message: 'finish' })
    port.onMessage.addListener(({ message, data }) => {
      if ((message = 'finish')) {
        dataModify = getCitiesandSalaries(data)
        dataModify.forEach((jobs) => {
          const li = document.createElement('li')
          li.innerHTML = `
            <h3>${jobs.city}</h3>
            <p>${jobs.jobs.length}</p>
          `

          const result = jobs.salary.reduce((acc, item) => {
            if (!acc[item]) {
              acc[item] = 0
            }
            acc[item]++
            return acc
          }, {})
          li.innerHTML += `
            <p>${JSON.stringify(result)}</p>
          `
          ulList.appendChild(li)
        })
        lblMessage.style.display = 'none'
      }
    })
  }, 20000)
})

const getCitiesandSalaries = (data) => {
  jobsFilters = data.filter((job) => job.city !== undefined) // Filter jobs with city

  jobsWithTitleSalary = jobsFilters.map((job) => ({
    title: job.title,
    salary: job.salary,
    city: job.city
  })) // Get title, salary and city

  totalCities = jobsFilters.map((job) => job.city) // Get all cities

  cities = Array.from(new Set(totalCities)) // Get unique cities

  resume = cities.map((city) => {
    const jobFilterByCountry = jobsWithTitleSalary.filter((job) =>
      job.city.includes(city)
    )

    // Filter salaries by city
    const salaries = jobFilterByCountry.map((job) => job.salary)

    return { city, jobs: jobFilterByCountry, salary: salaries }
  })

  return resume
}
