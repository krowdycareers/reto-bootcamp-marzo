import { useEffect, useState } from 'preact/hooks';
import { JobLocationComponent } from '@/components';

type JobInfoScrapFinished = {
	[key: string]: { [key: string]: number };
};

interface IProps {
	jobs: JobInfoScrapFinished[];
}

export const JobsInformationResultComponent = ({ jobs }: IProps) => {
	const [renderInfoJobs, setRenderInfoJobs] = useState(jobs);
	useEffect(() => {
		setRenderInfoJobs(jobs);
	}, [jobs]);

	return (
		<section className='jobs__info-container custom__scroll'>
			<h4 className='jobs__info-title'>Resultado del Scrap</h4>
			<ul className='jobs__info-list'>
				{renderInfoJobs.map((job) => (
					<JobLocationComponent job={job} />
				))}
			</ul>
		</section>
	);
};
