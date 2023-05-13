import { MESSAGE_STATUS, PORTS_NAME } from '@/enums';
import { getJobsInformationScrapFinished } from '@/helpers';
import { getLocalStorage } from '@/utils';

export const cmdStop = async () => {
	const {
		jobs: { jobsScrapped },
	} = await getLocalStorage('jobs');
	const jobsInformationScrapFinished =
		getJobsInformationScrapFinished(jobsScrapped);
	const portPopup = chrome.runtime.connect({
		name: PORTS_NAME.POPUP_BACKGROUND,
	});
	portPopup.postMessage({
		cmd: MESSAGE_STATUS.FINISH,
		jobs: jobsInformationScrapFinished,
	});
};
