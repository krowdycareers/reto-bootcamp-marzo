interface IPropsBtn {
	label: string;
	secondary?: true;
	disabled?: boolean;
	handleClick: () => unknown;
}

export const BtnComponent = ({
	label,
	secondary,
	disabled,
	handleClick,
}: IPropsBtn) => {
	const getClass = secondary ? 'btn btn-secondary' : 'btn';
	return (
		<button className={getClass} onClick={handleClick} disabled={disabled}>
			{label}
		</button>
	);
};
