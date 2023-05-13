import { IJobsInformation } from '@/interfaces';
import { addNewPageToURL, getLocalStorage, setLocalStorage } from '@/utils';

export const cmdNext = async (
	jobsInformation: IJobsInformation[],
	port: chrome.runtime.Port
) => {
	const { jobs } = await getLocalStorage('jobs');
	const jobsToLocalStorage = {
		jobsScrapped: jobs?.jobsScrapped
			? [...jobs?.jobsScrapped, ...jobsInformation]
			: [...jobsInformation],
	};
	await setLocalStorage('jobs', { ...jobsToLocalStorage });
	chrome.tabs.update(port.sender!.tab!.id!, {
		url: addNewPageToURL(port.sender!.tab!.url!),
	});
};
