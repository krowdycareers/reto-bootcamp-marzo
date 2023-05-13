import { MESSAGE_STATUS } from '@/enums';

export interface JobSalariesType {
	[key: string]: number;
}

export interface JobInfoScrapFinished {
	[key: string]: JobSalariesType;
}

export interface ParamsListenerClient {
	cmd: typeof MESSAGE_STATUS.FINISH;
	jobs: JobInfoScrapFinished[];
}
