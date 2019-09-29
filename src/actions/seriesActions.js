import firebase from 'firebase';
import { Alert,ToastAndroid } from 'react-native';
import axios from 'axios'


export const SET_WHATCHSERIES = 'SET_WHATCHSERIES';
const setWatchSeries = series => ({
  type: SET_WHATCHSERIES,
  series,
});

export const SET_WHATCHEDSERIES = 'SET_WHATCHEDSERIES';
const setWatchedSeries = seriesWatched => ({
  type: SET_WHATCHEDSERIES,
  seriesWatched,
});


export const watchSeries = (isWhachList) => {
  const { currentUser } = firebase.auth();
  if(isWhachList) {
    return dispatch => {
      firebase
        .database()
        .ref(`/users/${currentUser.uid}/`)
        .on('value', snapshot => {
          const result = snapshot.val()
  
          const { whatchlist } = result
  
          if (whatchlist) {
            console.log('lista', whatchlist)
            const array = Object.values(whatchlist);
            const action = setWatchSeries(array);
            dispatch(action)
          } else {
            return dispatch(setWatchSeries({}))
          }
        })
    }
  }
  return dispatch => {
    firebase
      .database()
      .ref(`/users/${currentUser.uid}/`)
      .on('value', snapshot => {
        const result = snapshot.val()
        const {seriesWatched} =  result
        if (seriesWatched) {
          const array = Object.values(seriesWatched);
          const action = setWatchedSeries(array);
          dispatch(action)
        } else {
          return dispatch(setWatchedSeries({}))
        }
      }) 
  }
  
}

export const addWatchList = (isAdd, movie, hideToast ) => {
	return dispatch => {
		return new Promise((resolve, reject) => {
        const { currentUser } = firebase.auth();
        if(isAdd){
						try {
							firebase
              .database()
              .ref(`/users/${currentUser.uid}/whatchlist/${movie.id}`)
              .set(movie)
              .then(() => {	
                resolve(true);
              })
						
						} catch(e) {
							reject(e);
            }
          }else {
            try {
              firebase
                .database()
                .ref(`/users/${currentUser.uid}/whatchlist/${movie.id}`)
                .remove()
                .then(() => {
                  !hideToast ? ToastAndroid.show(
                    'Desmarcado para assistir',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                  ) : null;
                  resolve(true);
                })
            }		catch(e) {
              reject(e);
            }
          }
          
          
        }
			)
		}
	}
