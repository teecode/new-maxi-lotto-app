// Draw-time helpers. Kept apart from lib/utils.ts, which almost every module imports,
// so moment only loads with the screens that show game times.
import moment from 'moment'

export const timeOnlyFormat = (gameTime: string) => {
	return moment(gameTime, 'YYYY-MM-DD h:mm:ss A').format('hh:mm A');
};

export const isGameClosed = (endGameTime: string) => {
	return moment(endGameTime, 'YYYY-MM-DD h:mm:ss A').isBefore(
		moment(new Date()).subtract(1, 'seconds')
	);
};

export const fullDateFormat = (date: string) => {
	return moment(date, 'YYYY-MM-DD h:mm:ss A').format('YYYY-MM-DD');
};

export const fullDateTimeFormat = (date: string) => {
	return moment(date, 'YYYY-MM-DD h:mm:ss A').format('YYYY-MM-DD HH:mm:ss');
};

export const timeFormat = (gameTime: string) => {
	return moment(gameTime, 'YYYY-MM-DD h:mm:ss A').format('hh:mm:ss A');
};
