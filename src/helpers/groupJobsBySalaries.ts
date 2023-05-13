type GroupSalary = { [key: string]: number };

export const groupBySalary = (salaries: string[]): GroupSalary =>
	salaries.reduce((acc: GroupSalary, next: string) => {
		acc[next] = acc[next] ? acc[next] + 1 : 1;
		return acc;
	}, {});
