import { MESSAGE_STATUS, PORTS_NAME } from '@/enums';
import { contentScriptCtrl } from './controllers';

type ParamsContentScriptListeners = { cmd: keyof typeof contentScriptCtrl };

const portBackground = chrome.runtime.connect({
	name: PORTS_NAME.CONTENT_BACKGROUND,
});

const scrapPage = ({ cmd }: ParamsContentScriptListeners) => {
	const postMessageData = contentScriptCtrl[cmd]();
	portBackground.postMessage({ ...postMessageData });
};

portBackground.postMessage({ cmd: MESSAGE_STATUS.ONLINE });

chrome.runtime.onConnect.addListener((port) => {
	port.onMessage.addListener(async (params: ParamsContentScriptListeners) => {
		scrapPage(params);
	});
});
