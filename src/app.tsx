import { useState } from 'preact/hooks';
import { JobInfoScrapFinished } from '@/interfaces';
import { handlerClickButtons } from '@/hooks';
import { BtnComponent, JobsInformationResultComponent } from '@/components';
import { runListenerFinishScrap } from '@/utils';

export function App() {
	const { scraping, handleClickStartButton, handleClickStopButton } =
		handlerClickButtons();
	const [jobs, setJobs] = useState<JobInfoScrapFinished[]>([]);

	runListenerFinishScrap(setJobs);
	return (
		<>
			<h1 class='title'>OCC Scraper</h1>

			{jobs.length > 0 && <JobsInformationResultComponent jobs={jobs} />}

			<BtnComponent
				label={scraping ? 'Procesando...' : 'Iniciar Scrap'}
				handleClick={handleClickStartButton}
				disabled={scraping}
			/>
			<BtnComponent
				secondary
				label='Parar'
				handleClick={handleClickStopButton}
				disabled={!scraping}
			/>
		</>
	);
}
