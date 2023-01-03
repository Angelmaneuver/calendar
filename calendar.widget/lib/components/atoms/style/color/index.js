import { css } from 'uebersicht';

const WHITE = '#E6E6E6';
const RED   = '#DC143C';
const BLUE  = '#191970';

const fontColor = (shadow) => css`
	--shadow-color: ${shadow ? shadow : WHITE};

	color:       ${WHITE};
	text-shadow: var(--shadow-color) 0.1em  0.1em 0.3em, var(--shadow-color) -0.1em  0.1em 0.3em,
				 var(--shadow-color) 0.1em -0.1em 0.3em, var(--shadow-color) -0.1em -0.1em 0.3em;

	&.blue {
		text-shadow: ${BLUE} 0.1em  0.1em 0.3em, ${BLUE} -0.1em  0.1em 0.3em,
					 ${BLUE} 0.1em -0.1em 0.3em, ${BLUE} -0.1em -0.1em 0.3em;
	}

	&.yellow {
		text-shadow: #FFEF6C 0.1em  0.1em 0.3em, #FFEF6C -0.1em  0.1em 0.3em,
					 #FFEF6C 0.1em -0.1em 0.3em, #FFEF6C -0.1em -0.1em 0.3em;
	}

	&.red {
		text-shadow: ${RED} 0.1em  0.1em 0.3em, ${RED} -0.1em  0.1em 0.3em,
					 ${RED} 0.1em -0.1em 0.3em, ${RED} -0.1em -0.1em 0.3em;
	}
`;

const boxShadowColor = (shadow) => css`
	--shadow-color: ${shadow ? shadow : WHITE};

	& {
		box-shadow:  0 0 0.5em var(--shadow-color);
	}

	&.blue {
		box-shadow:  0 0 0.5em ${BLUE};
	}

	&.yellow {
		box-shadow:  0 0 0.5em #FFEF6C;
	}

	&.red {
		box-shadow:  0 0 0.5em ${RED};
	}
`;

const dropShadowColor = (shadow) => css`
	--shadow-color: ${shadow ? shadow : WHITE};

	&:before, &:after {
		filter: drop-shadow(0 0 0.5em var(--shadow-color));
	}

	&.blue:before {
		filter: drop-shadow(0 0 0.5em ${BLUE});
	}

	&.yellow:before {
		filter: drop-shadow(0 0 0.5em #FFEF6C);
	}

	&.red:before {
		filter: drop-shadow(0 0 0.5em ${RED});
	}
`;


export {
	WHITE,
	RED,
	BLUE,
	fontColor,
	boxShadowColor,
	dropShadowColor,
}
