import { IJobsInformation } from '@/interfaces';

type JobsByLocation = { [key: string]: string[] };

export const groupJobsByLocation = (jobs: IJobsInformation[]) =>
	jobs.reduce(
		(acc: JobsByLocation, { location, salary }: IJobsInformation) => {
			if (!location || !salary) return acc;
			acc[location] = acc[location] || [];
			acc[location].push(salary);
			return acc;
		},
		{}
	);
