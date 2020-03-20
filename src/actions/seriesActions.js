import firebase from 'firebase';
import { Alert, ToastAndroid } from 'react-native';
import axios from 'axios';



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

export const GET_RECOMENDSERIES = 'GET_RECOMENDSERIES';
const getRecomendSeries = recomendSeries => ({
  type: GET_RECOMENDSERIES,
  recomendSeries,
});

//BUSCA AS DUAS LISTAS DE FILMES DO USUARIO (ASSISTIR/ASSISTIDOS)
export const watchSeries = (isWhachList) => {
  const { currentUser } = firebase.auth();
  if (isWhachList) {
    return dispatch => {
      firebase
        .database()
        .ref(`/users/${currentUser.uid}/`)
        .on('value', snapshot => {
          const result = snapshot.val()

          const { whatchlist } = result

          if (whatchlist) {
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
        const { seriesWatched } = result
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

//ADICIONA/REMOVE NA LISTA PARA ASSISTIR
export const addWatchList = (isAdd, movie, hideToast) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      const { currentUser } = firebase.auth();
      if (isAdd) {
        try {
          firebase
            .database()
            .ref(`/users/${currentUser.uid}/whatchlist/${movie.id}`)
            .set(movie)
            .then(() => {
              resolve(true);
            })

        } catch (e) {
          reject(e);
        }
      } else {
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
        } catch (e) {
          reject(e);
        }
      }


    }
    )
  }
}

//ADICIONA NA LISTA DE ASSISTIDOS
export const addWatchedList = (movie) => {
  console.log('actions', movie)
  return dispatch => {
    return new Promise((resolve, reject) => {
      const { currentUser } = firebase.auth();
      try {
        firebase
          .database()
          .ref(`/users/${currentUser.uid}/seriesWatched/${movie.id}`)
          .set(movie)
          .then(() => {
            // ToastAndroid.show(
            //   'Marcado como Assistido',
            //   ToastAndroid.SHORT,
            //   ToastAndroid.CENTER,
            // );
            // Alert.alert(
            //   'Compartilhar',
            //   'Deseja mostar aos seus amigos que você assistiu esse filme ?',
            //   [
            //     { text: 'Compartilhar', onPress: () => this.onShare() },
            //     {
            //       text: 'Cancelar',
            //       onPress: () => null,
            //       style: 'cancel',
            //     },
            //   ],
            //   { cancelable: false },
            // );
            resolve(true);

          })

      } catch (e) {
        reject(e);
      }

    })
  }
}

export const recomendSeries = (genresFavorite, seriesWatched, whatchlist) => {
  console.log(genresFavorite)
  return dispatch => {
    axios
      .get(`https://api.themoviedb.org/3/discover/movie?api_key=8f72024179b31532014de08efcc769c2&language=pt-BR&with_genres=${genresFavorite}`)
      .then(response => {
        let array =[] 
        response.data.results.map(recomend => {
          let itExist = false;
          whatchlist.map(watch => {
            console.log(recomend.id, '-', watch.id)
            if (recomend.id === watch.id) {
              itExist = true
              return true
            }
            seriesWatched.map(watched => {
              if (recomend.id === watched.id) {
                itExist = true
                return true
              }
            })
          })
          console.log(itExist)
          !itExist ? array.push(recomend) : null
        })

        // this.setState({ recomendList: array });
        // console.log('entrou aqui', array)
        const action = getRecomendSeries(array);
        dispatch(action)
      }).catch(error => {
        console.log(error)
      });
    // firebase
    //   .database()
    //   .ref(`/users/${currentUser.uid}/`)
    //   .on('value', snapshot => {
    //     const result = snapshot.val()

    //     const { whatchlist } = result

    //     if (whatchlist) {
    //       const array = Object.values(whatchlist);
    //       const action = setWatchSeries(array);
    //       dispatch(action)
    //     } else {
    //       return dispatch(setWatchSeries({}))
    //     }
    //   })
  }
}
