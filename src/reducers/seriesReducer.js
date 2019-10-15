import { SET_WHATCHSERIES, SET_WHATCHEDSERIES, GET_RECOMENDSERIES } from '../actions';

const INITIAL_STATE = {
	seriesWatched: [], 
	whatchlist: [] ,
	recomendList: []
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
		case GET_RECOMENDSERIES:
			return {
				...state,
				recomendList: action.recomendSeries
				};
		default:
			return state;
	}
}