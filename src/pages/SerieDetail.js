import { View, Text, StatusBar, ScrollView, Image, ToastAndroid, StyleSheet} from "react-native";
import React, { Component } from "react";
import Constants from "./../util/Constants";
import { callRemoteMethod } from "../util/WebServiceHandler";
import Loader from "../util/Loader";
import {Header, Icon} from 'react-native-elements'
import firebase from 'firebase'

class SerieDetail extends Component {
  static navigationOptions = {
    headerTitle: Constants.Strings.SECONDARY_TITLE,
    headerRight: <View />
  };

  state = {
    movieDetails: {}, 
    isLoading: false, 
    seriesFavorites: [],
    isFavorite: false
  };

  componentDidMount() {
    this.getMovieDetails();
    this.getSeries();
  }

  //Função que busca os detalhes do filme selecionado
  getMovieDetails = () => {
    var endpoint = Constants.URL.BASE_URL + "movie/" + this.props.navigation.state.params.id + "?" + Constants.URL.API_KEY;
    callRemoteMethod(this, endpoint, {}, "getMovieDetailsCallback", "GET", true);
  };

  //Seta a data em movieDetails
  getMovieDetailsCallback = response => {
    this.setState({ movieDetails: response });
  };

  //Busca as series na lista de favoritos do usuario 
  getSeries = async () => {
    const {currentUser} = firebase.auth();
   await firebase
        .database()
        .ref(`/users/${currentUser.uid}/`)
        .on('value', snapshot => {
            const {series } = snapshot.val()
            const array = Object.values( series );
            //console.log(array)
            this.setState({seriesFavorites: array})
        }) 
        
};
  //Função que menipula
  addSerie = async (serieFull, isAdd) => {
        const {currentUser} = firebase.auth();
        if(isAdd) {
            firebase
            .database()
            .ref(`/users/${currentUser.uid}/series/${this.state.movieDetails.id}`)
            .set(this.state.movieDetails) 
            .then(() => {
                ToastAndroid.show(
                    'Adicionado a Lista de Favoritos',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                  );
            })
        } else {
            firebase
            .database()
            .ref(`/users/${currentUser.uid}/series/${this.state.movieDetails.id}`)
            .remove() 
            .then(() => {
                ToastAndroid.show(
                    'Removido da Lista de Favoritos',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                  );
            })
        }
    }
    renderAddButton() {
        const {series} = this.state;
        const {serie} = this.props.navigation.state.params;

       let isFavorite = false;
       this.state.seriesFavorites.map((item) => {
        item.id === this.state.movieDetails.id ? isFavorite = true : null
         })
         console.log(this.state.movieDetails)
         console.log(this.state.seriesFavorites)
         console.log(isFavorite) 
         return (
             isFavorite ? 
             <Icon name='favorite'
             type='material'
             color='#fff'
             onPress={() => this.addSerie(this.state.movieDetails, false)} /> :
             <Icon name='favorite-border'
             type='material'
             color='#fff'
             onPress={() => this.addSerie(this.state.movieDetails, true)} />
         )
     }
  render() {
    return (
      <View style={{ backgroundColor: Constants.Colors.Grey }}>
           <Header backgroundColor={'#00796B'}
                leftComponent={{ icon: 'arrow-back', color: '#fff', size: 30, onPress: () => this.props.navigation.goBack() }}
                centerComponent={<Text style={{color: 'white', fontWeight: 'bold'}}>{this.state.movieDetails.title}</Text>}
                rightComponent={this.renderAddButton()}
            />
        <StatusBar backgroundColor={Constants.Colors.Cyan} barStyle="light-content" />
        {this.state.isLoading ? <Loader show={true} loading={this.state.isLoading} /> : null}
        <ScrollView style={Styles.movieCard} showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: "center" }}>
            <Image
              style={Styles.image}
              source={{
                uri:
                  this.state.movieDetails.poster_path != null
                    ? Constants.URL.IMAGE_URL + this.state.movieDetails.poster_path
                    : Constants.URL.PLACEHOLDER_IMAGE
              }}
            />
            <Text style={{ fontSize: 16, margin: 5, fontWeight: "bold" }}>{this.state.movieDetails.original_title}</Text>
          </View>
          <View style={{ flexDirection: "row", margin: 10 }}>
            <Text style={{ flex: 0.5 }}>{Constants.Strings.STATUS}</Text>
            <Text style={{ flex: 0.5 }}>{this.state.movieDetails.status}</Text>
          </View>
          <View style={{ flexDirection: "row", margin: 10 }}>
            <Text style={{ flex: 0.5 }}>{Constants.Strings.RATINGS}</Text>
            <Text style={{ flex: 0.5 }}>
              {this.state.movieDetails.vote_average}
              /10
            </Text>
          </View>
          <View style={{ flexDirection: "row", margin: 10 }}>
            <Text style={{ flex: 0.5 }}>{Constants.Strings.POPULARITY}</Text>
            <Text style={{ flex: 0.5 }}>{this.state.movieDetails.popularity}%</Text>
          </View>
          <View style={{ flexDirection: "row", margin: 10 }}>
            <Text style={{ flex: 0.5 }}>{Constants.Strings.BUDGET}</Text>
            <Text style={{ flex: 0.5 }}>${this.state.movieDetails.budget}</Text>
          </View>
          <View style={{ flexDirection: "row", margin: 10 }}>
            <Text style={{ flex: 0.5 }}>{Constants.Strings.REVENUE}</Text>
            <Text style={{ flex: 0.5 }}>${this.state.movieDetails.revenue}</Text>
          </View>
          <View style={{ flexDirection: "row", margin: 10 }}>
            <Text style={{ flex: 0.5 }}>{Constants.Strings.RUNTIME}</Text>
            <Text style={{ flex: 0.5 }}>{this.state.movieDetails.runtime} min</Text>
          </View>
          <View style={{ flexDirection: "row", margin: 10 }}>
            <Text style={{ flex: 0.5 }}>{Constants.Strings.LANGUAGE}</Text>
            <Text style={{ flex: 0.5 }}>{this.state.movieDetails.original_language}</Text>
          </View>
          <View style={{ margin: 10 }}>
            <Text style={{ flex: 0.2 }}>{Constants.Strings.OVERVIEW}</Text>
          </View>
          <View style={{ margin: 10 }}>
            <Text style={{ flexWrap: "wrap", flex: 0.8 }}>{this.state.movieDetails.overview}</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  movieCard: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: "white",
    elevation: 10
  },
  image: { width: 160, height: 220, marginLeft: 5, margin: 20 }
})

export default SerieDetail;