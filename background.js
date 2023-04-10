let statusScrap = 'stop';

const saveObjectInLocalStorage = async function (obj){

    return new Promise((resolve, reject) => {
        try {            
            chrome.storage.local.set(obj, function () {
                resolve();
            });
        }catch(ex){
            reject(ex);
        }
    });
};

const getObjectInLocalStorage = async function (obj){
    return new Promise((resolve, reject) => {
        try {            
            chrome.storage.local.get(key, function (value) {
                resolve(value);
            });
        }catch(ex){
            reject(ex);
        }
    });
};

function addPageToURL(url){
    const regex = /page=(\d+)/;
    const match = url.match(regex);
    const page = match && match[1];
    const newPage = parseInt(page) + 1;
    return url.replace(regex, `page=${newPage}`);
}

chrome.runtime.onConnect.addListener( function (port) {
    port.onMessage.addListener( async function ({message, data}, sender, sendResponse) {
        if(message == 'start') {
            const [tab] = await chrome.tabs.query({ 
                active: true, 
                currentWindow: true 
            });
            if (!tab) return;

            statusScrap = "start";
            let port = chrome.tabs.connect(tab.id, {name: "background-to-content"});
            port.postMessage({message: "scrap"});
            return;
        }

        if(message == 'next') {
            console.log(sender.sender.tab);
            const url = addPageToURL(sender.sender.tab.url)
            await chrome.tabs.update(sender.sender.tab.id, {
                url: url
            });
            return;
        }

        if(message == 'online' && statusScrap == "start") {
            port.postMessage({message: "scrap"});
            return;
        }

        if(message == 'stop'){
            console.log(data);
            port.postMessage({message: "finished", data});
            return
        }
    });
});