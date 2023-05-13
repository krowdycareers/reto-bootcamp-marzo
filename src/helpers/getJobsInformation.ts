import { IJobsInformation } from '@/interfaces';
import { getTextContext } from '@/utils';

export const getJobsInformation = (): IJobsInformation[] | null => {
	const elemCardJobs = [...document.querySelectorAll("[id*='jobcard-']")];
	return (
		elemCardJobs.map((job) => ({
			location: getTextContext(job, "div[style='flex:1'] p"),
			salary: getTextContext(job, "span[class*='salary-']"),
		})) || elemCardJobs
	);
};
