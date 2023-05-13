import { JobInfoScrapFinished } from '@/interfaces';
import { JobRangeAndQtyComponent } from './JobRangeAndQtyComponent';

interface IProps {
	job: JobInfoScrapFinished;
}

export const JobLocationComponent = ({ job }: IProps) => {
	return (
		<li className='jobs__info-list-item'>
			{Object.keys(job).map((location) => (
				<>
					<h3 className='jobs__info-list-item-location'>
						{location}
					</h3>
					<JobRangeAndQtyComponent salaries={job[location]} />
				</>
			))}
		</li>
	);
};
