import { css }    from 'uebersicht';
import * as Atoms from '../../../atoms';
import { Cell }   from './cell.jsx';
import { Title }  from './title.jsx';

const Chart = ({
	className,
	style,
	prefix,
	events,
	suspensionPosition,
}) => {
	let   suspensionRange = [];
	const chart           = events.reduce((accumulator, event, index, array) => {
		if (suspensionPosition >= index) {
			const className = (() => {
				if (event.isEvent) {
					if (
						event.range.includes('between') || suspensionPosition === index
					) {
						return event.range.join(' ');
					} else if ((
						!(event.range.includes('start') && event.range.includes('end'))
					) && (
						event.range.includes('start')
					)) {
						return 'between';
					} else {
						return '';
					}
				} else {
					return '';
				}
			})();

			accumulator.push(<Cell key = { `${prefix}-${index}` } className = { `${className}`.trim() } color = { event.color }/>);

			if (suspensionPosition === index && event.range.includes('start')) {
				accumulator.push(<Title key = { `${prefix}-${index + 1}` } className = 'event' color = { event.color }>{ event.title }</Title>);
			}
		} else {
			if ((
				!suspensionRange.includes('start') && suspensionRange.includes('end')
			) && (
				event.isEvent
			) && (
				!event.range.includes('start') && !event.range.includes('between')
			)) {
				accumulator.push(<Cell key = { `${prefix}-${index}` } className = 'between' color = { event.color }/>);
			}
		}

		if (suspensionPosition === index) {
			suspensionRange = event.range;
		}

		return accumulator;
	}, []);

	return (
		<Atoms.Row
			className = { `chart ${ className ? className : '' } ${baseStyle(style)}`.trim() }
		>
			{ chart }
		</Atoms.Row>
	);
}

const baseStyle = (style) => css`
	height:      100%;
	align-items: center;

	${style}
`;

export {
	Chart,
};
