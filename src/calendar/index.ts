type Day             = {
	date:    Date,
	holiday: {
		isHoliday: boolean,
		title?:    string,
		color?:    string,
		range?:    Array<Calendar_Range>,
	},
	events:  Array<{
		isEvent:   boolean,
		title?:    string,
		color?:    string,
		range?:    Array<Calendar_Range>,
	}>,
};

const CALENDAR_RANGE = {
	START:   'start',
	BETWEEN: 'between',
	END:     'end',
} as const;

type Calendar_Range  = typeof CALENDAR_RANGE[keyof typeof CALENDAR_RANGE];

type Calendar_Event  = {
	title:    string,
	location: string,
	url:      string,
	start:    string,
	end:      string,
	allDay:   boolean,
	calendar: {
		title: string,
		color: string,
	},
};

class Calendar {
	private calendar:                Record<string, Day>;
	private events:                  Array<Calendar_Event>;
	private holiday_calendar_title?: string;

	constructor(
		start:                   Date,
		end:                     Date,
		events:                  Array<Calendar_Event>,
		holiday_calendar_title?: string,
	) {
		this.calendar               = {};
		this.events                 = events;
		this.holiday_calendar_title = holiday_calendar_title;

		const counter = new Date(start);

		while (counter <= end) {
			this.setEventsOfDay(counter);

			counter.setDate(counter.getDate() + 1);
		}
	}

	public get data(): Record<string, Day> {
		return this.calendar;
	}

	private setEventsOfDay(day: Date): void {
		const key    = Calendar.date2key(day);
		const target = new Date(day);

		if (!(key in this.calendar)) {
			this.calendar[key] = Calendar.initial(target);
		}

		const events = this.events.filter((event) => {
			const start = new Date(event.start);
			const end   = new Date(event.end);

			if ((
				Calendar.equalYMD(start, target)
			) || (
				target.getTime() >= start.getTime() &&
				target.getTime() <= end.getTime()
			)) {
				if (this.holiday_calendar_title === event.calendar.title) {
					this.setHolidays(target, end, event.title, event.calendar.color);
				} else {
					this.setEventdays(target, end, event.title, event.calendar.color);
				}
			} else {
				return event;
			}
		});

		this.events = events;
	}

	private setHolidays(start: Date, end: Date, title: string, color: string) {
		const counter = new Date(start);

		while (counter <= end) {
			const key    = Calendar.date2key(counter);
			const target = new Date(counter);

			if (!(key in this.calendar)) {
				this.calendar[key] = Calendar.initial(target);
			}

			this.calendar[key].holiday = {
				isHoliday: true,
				title:     title,
				color:     color,
				range:     Calendar.getRange(start, end, target),
			};

			counter.setDate(counter.getDate() + 1);
		}
	}

	private setEventdays(start: Date, end: Date, title: string, color: string) {
		const startKey = Calendar.date2key(start);

		if (!(startKey in this.calendar)) {
			this.calendar[startKey] = Calendar.initial(start);
		}

		let   destination = 0;
		const events      = this.calendar[startKey].events;
		const check       = events.some((event, index) => {
			if (!event.isEvent) {
				destination = index;

				return true;
			} else {
				return false;
			}
		});

		if (!check) {
			events.push({ isEvent: false });

			destination = events.length - 1;
		}

		const counter = new Date(start);

		while (counter <= end) {
			const key    = Calendar.date2key(counter);
			const target = new Date(counter);

			if (!(key in this.calendar)) {
				this.calendar[key] = Calendar.initial(target);
			}

			for (let i = this.calendar[key].events.length; i <= destination; i++) {
				this.calendar[key].events.push({ isEvent: false });
			}

			this.calendar[key].events[destination] = {
				isEvent: true,
				title:   title,
				color:   color,
				range:   Calendar.getRange(start, end, target),
			}

			counter.setDate(counter.getDate() + 1);
		}
	}

	private static initial(day: Date): Day {
		return {
			date:    new Date(day),
			holiday: {
				isHoliday: false,
			},
			events:  [{
				isEvent:   false,
			}],
		};
	}

	private static date2key(date: Date): string {
		return `${date.getFullYear().toString()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
	}

	private static equalYMD(date1: Date, date2: Date): boolean {
		return (
			date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth()    === date2.getMonth()    &&
			date1.getDate()     === date2.getDate()
		);
	}

	private static getRange(start: Date, end: Date, day: Date): Array<Calendar_Range> {
		const ranges = [];

		if (Calendar.equalYMD(start, day) && Calendar.equalYMD(end, day)) {
			ranges.push(CALENDAR_RANGE.START);
			ranges.push(CALENDAR_RANGE.END);
		} else if (Calendar.equalYMD(start, day)) {
			ranges.push(CALENDAR_RANGE.START);
		} else if (Calendar.equalYMD(end, day)) {
			ranges.push(CALENDAR_RANGE.END);
		} else {
			ranges.push(CALENDAR_RANGE.BETWEEN);
		}

		return ranges as Array<Calendar_Range>;
	}
}

export {
	Calendar,
};
