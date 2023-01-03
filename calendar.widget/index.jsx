import { run, React } from 'uebersicht';
import { Calendar }   from './lib/libraries.bundle';
import * as Component from './lib/components';
import * as Language  from './lib/languages';

const LANGUAGE                = Language.EN;

const HOLIDAY_CALENDAR_TITLE  = '';
const CALENDAR_RANGE_SETTER   = (() => {
	const today = new Date();

	today.setHours(0);
	today.setMinutes(0);
	today.setSeconds(0);

	const start = new Date(today);
	const end   = new Date(start);

	end.setMonth(end.getMonth() + 1);
	end.setDate(end.getDate() - 1);
	end.setHours(23);
	end.setMinutes(59);
	end.setSeconds(59);

	return {
		START: start,
		END:   end,
	};
});
const CALENDAR_RANGE          = CALENDAR_RANGE_SETTER();

const NORMAL_WIDTH            = '30em';
const MINIMIZE_WIDTH          = '30em';

export const className        = `
	top:        0;
	left:       0;
	font-style: italic;
`;

const mainStyle               = {
	minHeight:     '58vh',
	maxHeight:     '58vh',
	padding:       '1em',
	margin:        '0.3em',
	borderRadius:  '0.2em',
	background:    'rgba(51,49,50,.65)',

	'.calendar': {
		'.date-row': {
			'&:not(:first-child)': {
				'.date-box': {
					'.date, .holiday': {
						paddingTop: '0.8em',
					}
				}
			},

			'.date-box': {
				'.date': {
					width:         '1em',
					fontSize:      '2em',
					paddingRight:  '0.5em',
					paddingBottom: '0.05em',

					'.day': {
						textAlign: 'right',
					},
					'.day-of-week': {
						fontSize:  '0.5em',
						textAlign: 'center',
					}
				},
				'.events, .holiday': {
					fontSize:     '0.9em',
				},
				'.holiday': {
					width:        '10em',
					paddingRight: '0.25em',
				},
			}
		}
	}
};

const STATUS                  = {
	STARTUP:  'C/STARTUP',
	ACTIVE:   'C/ACTIVE',
	MINIMIZE: 'C/MINIMIZE',
};

export const command          = `./calendar.widget/bin/icc --m --nm`;

export const refreshFrequency = false;

export const initialState     = { type: STATUS.STARTUP };

export const updateState      = (event, previousState) => {
	if (event.error) {
		return { ...previousState, warning: `We got an error. ${event.error}` };
	}

	const type     = (() => {
		const state = { ...previousState, ...event };

		return (STATUS.ACTIVE !== state.type && STATUS.MINIMIZE !== state.type) ? STATUS.ACTIVE : state.type;
	})();

	const calendar = new Calendar(
		CALENDAR_RANGE.START,
		CALENDAR_RANGE.END,
		JSON.parse(event.output).data,
		HOLIDAY_CALENDAR_TITLE,
	);

	return {
		...previousState,
		type:     type,
		calendar: calendar.data
	};
}

export const render           = (props, dispatch) => {
	let main;

	if (props.warning) {
		main = (
			<Component.Molecuels.Information
				className = { `red` }
			>
				{ props.warning }
			</Component.Molecuels.Information>
		);
	} else if (STATUS.ACTIVE === props.type) {
		main = (
			<React.Fragment>
				<Component.Molecuels.Toolbar
					outlineFormat   = { LANGUAGE.OUTLINE_FORMAT }
					onClickMinimize = { () => reload(STATUS.MINIMIZE, dispatch) }
					onClickReload   = { () => reload(STATUS.ACTIVE,   dispatch) }
				/>
				<Component.Atoms.Row
					style = {{
						...mainStyle,
						flexDirection: 'column',
						overflowY:     'scroll',
						overflowX:     'hidden',
					}}
				>
					<Component.Molecuels.Calendar
						format   = { LANGUAGE.FORMAT }
						calendar = { props.calendar }
					/>
				</Component.Atoms.Row>
			</React.Fragment>
		);
	} else if (STATUS.MINIMIZE === props.type) {
		main = (
			<React.Fragment>
				<Component.Molecuels.Toolbar
					outlineFormat   = { LANGUAGE.OUTLINE_FORMAT }
					onClickMaximize = { () => reload(STATUS.ACTIVE, dispatch) }
				/>
			</React.Fragment>
		);
	}

	return (
		<div
			style = {{
				width: STATUS.MINIMIZE === props.type ? MINIMIZE_WIDTH : NORMAL_WIDTH
			}}
		>
			{ main }
		</div>
	);
}

function reload(type, dispatch) {
	CALENDAR_RANGE_SETTER();

	run(
		command
	).then(
		(output) => { dispatch({ type: type, output: output }); }
	).catch(
		(error)  => { dispatch({ error: error }); }
	);
}
