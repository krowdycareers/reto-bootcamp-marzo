import { IJobsInformation } from '@/interfaces';
import { backgroundCtrl } from './controllers';
import { MESSAGE_STATUS } from '@/enums';
import { cmdBackgroundTypes } from '@/types';

type BackgroundCtrlParams = {
	cmd: cmdBackgroundTypes;
	jobs?: IJobsInformation[];
};

chrome.runtime.onConnect.addListener((port) => {
	port.onMessage.addListener(
		async (
			{ cmd, jobs }: BackgroundCtrlParams,
			port: chrome.runtime.Port
		) => {
			backgroundCtrl.setPort(port);
			const cmdIsNext = cmd === MESSAGE_STATUS.NEXT;
			if (!cmdIsNext) return backgroundCtrl[cmd]();
			else if (cmdIsNext && jobs) return backgroundCtrl[cmd](jobs);
		}
	);
});
