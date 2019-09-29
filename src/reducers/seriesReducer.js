import { SET_WHATCHSERIES, SET_WHATCHEDSERIES } from '../actions';

const INITIAL_STATE = {
	seriesWatched: [], 
	whatchlist: [] 
}

export default function (state = INITIAL_STATE, action) {
	switch (action.type) {
		case SET_WHATCHSERIES:
			return {
				...state,
				whatchlist: action.series
				};
		case SET_WHATCHEDSERIES:
			return {
				...state,
				seriesWatched: action.seriesWatched
				};
		default:
			return state;
	}
}