import { useState } from 'preact/hooks';
import { MESSAGE_STATUS, PORTS_NAME } from '@/enums';

export const handlerClickButtons = () => {
	const [scraping, setScraping] = useState<boolean>(false);
	const port = chrome.runtime.connect({
		name: PORTS_NAME.POPUP_BACKGROUND,
	});
	const handleClickStartButton = () => {
		setScraping(true);
		port.postMessage({ cmd: MESSAGE_STATUS.START });
	};
	const handleClickStopButton = () => {
		setScraping(false);
		port.postMessage({ cmd: MESSAGE_STATUS.STOP });
	};
	return {
		scraping,
		handleClickStartButton,
		handleClickStopButton,
	};
};
