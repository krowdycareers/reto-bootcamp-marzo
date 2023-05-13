import { IJobsInformation } from '@/interfaces';
import { getJobsInformation } from '@/helpers';
import { MESSAGE_STATUS } from '@/enums';

export const cmdScrap = () => {
	let jobs: IJobsInformation[] | null = getJobsInformation();
	const nextPageButton = document.querySelector('[class*=next-]');
	const nextIsDisabled = () => {
		if (!nextPageButton) return true;
		const { classList } = nextPageButton;
		return classList.value.includes('disabled');
	};
	const { STOP, NEXT } = MESSAGE_STATUS;
	const cmd = nextIsDisabled() ? STOP : NEXT;
	return { cmd, jobs };
};
