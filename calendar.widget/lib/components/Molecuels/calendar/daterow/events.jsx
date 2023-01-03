import { css }    from 'uebersicht';
import * as Atoms from '../../../atoms';
import { Chart }  from './chart.jsx';

const Events = ({
	className,
	style,
	prefix,
	events,
}) => {
	const suspensionPositions = events.reduce((accumulator, current, index, array) => {
		if ((
			current.isEvent
		) && (
			current.range.includes('start') ||
			current.range.includes('end')   ||
			array.length - 1 === index
		)) {
			accumulator.push(index);
		}

		return accumulator;
	}, []);
	const charts              = suspensionPositions.map((suspensionPosition, index) => {
		return (<Chart key = { `${prefix}-${index}` } events = { events } suspensionPosition = { suspensionPosition }/>);
	});

	return (
		<Atoms.Row
			className = { `events ${ className ? className : '' } ${baseStyle(style)}`.trim() }
		>
			{ charts }
		</Atoms.Row>
	);
}

const baseStyle = (style) => css`
	flex-direction: column;

	${style}
`;

export {
	Events,
};
