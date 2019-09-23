import firebase from 'firebase';
import { Alert } from 'react-native';
import axios from 'axios'
export const SET_SERIES = 'SET_SERIES';
const setSeries = series => ({
	type: SET_SERIES,
	series,
});

export const watchSeries = () => {
            let res =  axios.get("https://api.themoviedb.org/3/movie/popular?api_key=b83e15027df50325aa48d0cdc5c9bf30&language=pt-BR&limit=10");
            let {results} = res.data;
          //  let dataJson = res.;
            //this.setState({ series: results});
            console.log(results) 
        };