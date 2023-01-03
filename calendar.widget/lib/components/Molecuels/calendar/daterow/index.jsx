import { css, React } from 'uebersicht';
import * as Atoms     from '../../../atoms';
import { Title }      from './title.jsx';
import { Events }     from './events.jsx';

const DateRow = ({
	className,
	style,
	format,
	prefix,
	date,
}) => {
	const color   = (() => {
		if (date.holiday.isHoliday) {
			return date.holiday.color;
		} else if (0 === date.date.getDay()) {
			return Atoms.Style.RED;
		} else if (6 === date.date.getDay()) {
			return Atoms.Style.BLUE;
		} else {
			return undefined;
		}
	})();
	const holiday = (() => {
		if (date.holiday.isHoliday && date.holiday.range.includes('start')) {
			return <Title className = 'holiday' color = { color }>{ date.holiday.title }</Title>;
		} else {
			return undefined;
		}
	})();
	const day     = (
		format.DAY
		.replace('$YEAR',  date.date.getFullYear())
		.replace('$MONTH', date.date.getMonth() + 1)
		.replace('$DATE',  date.date.getDate())
	);

	return (
		<Atoms.Row
			className = { `date-row ${ className ? className : '' } ${baseStyle(color, style)}`.trim() }
		>
			<Atoms.Row className = 'date-box'>
				<div className = 'date'>
					<div className = { `day ${Atoms.Style.fontColor(color)}`.trim() }>{ day }</div>
					<div className = { `day-of-week ${Atoms.Style.fontColor(color)}`.trim() }>{ format.DAY_OF_THE_WEEK[date.date.getDay()] }</div>
				</div>
				<Title  className = 'holiday' color = { color }>{ holiday }</Title>
				<Events
					prefix = { prefix }
					events = { date.events }
				/>
			</Atoms.Row>
		</Atoms.Row>
	);
}

const baseStyle = (shadow, style) => css`
	flex-direction: column;

	&:after {
		--shadow-color: ${shadow ? shadow : Atoms.Style.WHITE};

		content:          '';
		width:            100%;
		height:           1px;
		background-color: ${Atoms.Style.WHITE};
		box-shadow:       0 0 0.5em var(--shadow-color);
	}

	div.events {
		flex: 1;
	}

	${style}
`;

export {
	DateRow,
};
