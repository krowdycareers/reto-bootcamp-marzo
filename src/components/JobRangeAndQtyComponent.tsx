import { JobSalariesType } from '@/interfaces';

interface IProps {
	salaries: JobSalariesType;
}

export const JobRangeAndQtyComponent = ({ salaries }: IProps) => {
	return (
		<>
			{Object.entries(salaries).map(([salary, qty]) => (
				<section className='jobs__info-list-item-rangeSalary-qty__container'>
					<p>{salary}</p>
					<span>{qty}</span>
				</section>
			))}
		</>
	);
};
