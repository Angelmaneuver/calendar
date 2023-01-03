import { css }    from 'uebersicht';
import * as Atoms from '../../../atoms';

const Cell = ({
	className,
	style,
	color,
}) => {
	return (
		<div
			className = { `cell ${baseStyle(style)}`.trim() }
		>
			<span
				className = { `${ className ? className : '' } ${Atoms.Style.dropShadowColor(color)}`.trim() }
			/>
		</div>
	);
}

const baseStyle = (style) => css`
	width:  1em;
	height: 100%;

	span {
		display:       inline-block;
		position:      relative;
		width:         100%;
		height:        100%;

		&.start,
		&.end,
		&.between {
			&:not(.between):before {
				content:       '';
				position:      absolute;
				top:           50%;
				left:          50%;
				width:         0.5em;
				height:        0.5em;
				border-radius: 50%;
				background:    ${Atoms.Style.WHITE};
				transform:     translate(-50%, -50%);
			}

			&:not(.start):not(.end) {
				&:before, &:after {
					height: 100%;
				}
			}

			&:after {
				position:   absolute;
				left:       50%;
				width:      0.1em;
				height:     50%;
				background: ${Atoms.Style.WHITE};
				transform:  translateX(-50%);
			}

			&:not(.end):after {
				content: '';
				top:     50%;
			}

			&:not(.start):after {
				content: '';
				top:     0;
			}
		}
	}

	${style}
`;

export {
	Cell,
};
