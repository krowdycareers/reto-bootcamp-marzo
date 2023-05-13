import { MESSAGE_STATUS } from '@/enums';
import { JobInfoScrapFinished, ParamsListenerClient } from '@/interfaces';

export const runListenerFinishScrap = (
	setJobs: (jobs: JobInfoScrapFinished[]) => void
) =>
	chrome.runtime.onConnect.addListener((port) => {
		port.onMessage.addListener(
			async ({ cmd, jobs }: ParamsListenerClient) =>
				cmd === MESSAGE_STATUS.FINISH && setJobs([...jobs])
		);
	});
