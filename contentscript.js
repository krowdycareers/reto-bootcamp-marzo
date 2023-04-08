// We conect to the background script
const portBackground = chrome.runtime.connect({ name: 'content-background' })

// We send a message to the background script
portBackground.postMessage({ message: 'online' })

portBackground.onMessage.addListener(async ({ message }) => {
  if (message === 'scrap') {
    wait(3000)
    const jobs = getJobInformation()
    const nextPageButton = document.querySelector('[class *= next-]')
    const message = !!nextPageButton ? 'next' : ''
    portBackground.postMessage({ message, data: jobs })
  }
})

const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(({ message }) => {
    if (message === 'scrap') {
      const jobs = getJobInformation()
      const nextPageButton = document.querySelector('[class *= next-]')
      const message = !!nextPageButton ? 'next' : ''
      portBackground.postMessage({ message, data: jobs })
    }
  })
})

const getJobInformation = () => {
  const elementCardJobs = [...document.querySelectorAll('[id*="jobcard-"]')]
  const jobs = elementCardJobs.map((cardJob) => {
    const [
      { href: url },

      {
        children: [
          {
            children: [
              {},
              { innerText: title },
              { innerText: salary },
              { innerText: beneficios },
              {
                children: [elemtEmpresaCiudad]
              }
            ]
          }
        ]
      }
    ] = cardJob.children

    const empresa = elemtEmpresaCiudad?.querySelector('label')?.innerText
    const city = elemtEmpresaCiudad?.querySelector(
      "[class *= 'link-0-2']"
    )?.innerText

    return { url, title, salary, beneficios, empresa, city }
  })

  return jobs
}
