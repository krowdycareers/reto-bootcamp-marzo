import { IJobsInformation } from '@/interfaces';
import { groupBySalary, groupJobsByLocation } from '@/helpers';

export const getJobsInformationScrapFinished = (jobs: IJobsInformation[]) => {
	const jobsByLocation = groupJobsByLocation(jobs);
	return Object.entries(jobsByLocation).map(
		([location, salaries]: [string, string[]]) => {
			return {
				[location]: groupBySalary(salaries),
			};
		}
	);
};
