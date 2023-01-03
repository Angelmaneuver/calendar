import { css }     from 'uebersicht';
import * as Atoms  from '../../atoms';
import { DateRow } from './daterow/index.jsx';

const Calendar = ({
	className,
	style,
	format,
	calendar,
}) => {
	const dates = Object.keys(calendar).sort().map((day) => {
		return (
			<DateRow
				key    = { day }
				format = { format }
				prefix = { `${day}` }
				date   = { calendar[day] }
			/>
		);
	});

	return (
		<Atoms.Row
			className = { `calendar ${ className ? className : '' } ${baseStyle(style)}`.trim() }
		>
			{ dates }
		</Atoms.Row>
	);
}

const baseStyle = (style) => css`
	flex-direction: column;

	${style}
`;

export {
	Calendar,
};
