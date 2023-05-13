import { MESSAGE_STATUS, PORTS_NAME } from '@/enums';

export const cmdStart = async () => {
	const [tab] = await chrome.tabs.query({
		active: true,
		currentWindow: true,
	});
	if (!tab) return;
	const port = chrome.tabs.connect(tab.id!, {
		name: PORTS_NAME.BACKGROUND_CONTENT,
	})!;
	port.postMessage({ cmd: MESSAGE_STATUS.SCRAP });
};
