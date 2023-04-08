let statusScrap = 'stop'
let jobsAcumulado = []

const saveObjectInLocalStorage = async (obj) => {
  new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set(obj, () => {
        resolve()
      })
    } catch (ex) {
      reject(ex)
    }
  })
}

const getObjectInLocalStorage = async (obj) => {
  new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(key, (value) => {
        resolve(value)
      })
    } catch (ex) {
      reject(ex)
    }
  })
}
const addPageToURL = (url) => {
  const regex = /page=(\d+)/
  const match = url.match(regex)
  const page = match && match[1]
  const newPage = parseInt(page) + 1
  return url.replace(regex, `page=${newPage}`)
}

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(
    async ({ message, data }, sender, sendResponse) => {
      if (message === 'start') {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true
        })
        if (!tab) port.postMessage({ message: 'error' })
        statusScrap = 'start'
        let portConent = chrome.tabs.connect(tab.id, {
          name: 'background-content'
        })
        portConent.postMessage({ message: 'scrap' })
        return
      }

      if (message === 'next') {
        const url = addPageToURL(sender.sender.tab.url)
        await chrome.tabs.update(sender.sender.tab.id, {
          url: url
        })
        jobsAcumulado = [...jobsAcumulado, ...data]
        return
      }

      if (message === 'online' && statusScrap === 'start') {
        port.postMessage({ message: 'scrap' })
        return
      }

      if (message === 'finish') {
        statusScrap = 'finish'
        port.postMessage({ message: 'finish', data: jobsAcumulado })
        jobsAcumulado = []
        return
      }
    }
  )
})
