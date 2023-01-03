import { css }    from 'uebersicht';
import * as Atoms from '../../../atoms';

const Title = ({
	className,
	style,
	color,
	children,
}) => {
	return (
		<div
			className = { `${ className ? className : '' } ${baseStyle(style)} ${Atoms.Style.fontColor(color)}`.trim() }
		>
			{ children }
		</div>
	);
}

const baseStyle = (style) => css`
	${style}
`;

export {
	Title,
};
