import { View, Text, StatusBar, ScrollView, Image, ToastAndroid, StyleSheet, Switch, Share, Alert } from "react-native";
import React, { Component } from "react";
import Constants from "../../util/Constants";
import { callRemoteMethod } from "../../util/WebServiceHandler";
import Loader from "../../util/Loader";
import { Header, Icon, Button } from 'react-native-elements'
import firebase from 'firebase'
import { addWatchList, watchSeries, addWatchedList } from '../../actions';
import { connect } from 'react-redux';
class SerieDetail extends Component {
  static navigationOptions = {
    headerTitle: Constants.Strings.SECONDARY_TITLE,
    headerRight: <View />
  };

  state = {
    movieDetails: {},
    isLoading: false,
    whatchlist: [],
    isFavorite: false,
    switchValue: false,
    seriesWatched: []
  };

  toggleSwitch = (value) => {

    this.props.addWatchedList(this.state.movieDetails).then(() => {
      this.props.addWatchList(false, this.state.movieDetails, true)
    })
    this.setState({ switchValue: value })
  }
  componentDidMount() {
    this.getMovieDetails();
    this.props.watchSeries(true)
    this.props.watchSeries(false)
  }

  //Função que busca os detalhes do filme selecionado
  getMovieDetails = () => {
    var endpoint = Constants.URL.BASE_URL + "movie/" + this.props.navigation.state.params.id + "?" + Constants.URL.API_KEY;
    callRemoteMethod(this, endpoint, {}, "getMovieDetailsCallback", "GET", true);
  };

  //Seta a data em movieDetails
  getMovieDetailsCallback = response => {
    this.setState({ movieDetails: response });
    const { seriesWatched } = this.props;
    let isWatched = false;
    seriesWatched.map((item) => {
      item.id === this.state.movieDetails.id ? isWatched = true : null
    })
    this.setState({ switchValue: isWatched })
  };

  //Renderiza o botão de adicionar aos favoritos
  renderAddButtonFavorites() {

    let isFavorite = false;
    const { whatchlist } = this.props;
    console.log('SERIES', whatchlist)
    console.log('aaaaa', this.state.movieDetails.id)
    whatchlist.map((item) => {
      item.id === this.state.movieDetails.id ? isFavorite = true : null
    })
    if (!this.state.switchValue) {
      return (isFavorite ?
        <Icon name='check-box'
          type='material'
          color='#fff'
          onPress={() => {
            this.props.addWatchList(false, this.state.movieDetails, true).then(() => {
              ToastAndroid.show(
                'Removido da lista',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
              );
              this.setState({ isFavorite: false })
            }); isFavorite = false
          }} /> :
        <Icon name='check-box-outline-blank'
          type='material'
          color='#fff'
          onPress={() => this.props.addWatchList(true, this.state.movieDetails).then(() => {
            ToastAndroid.show(
              'Marcado para assistir',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
          })} />)
    } else {
      return <Icon name='share'
        type='material'
        color='#fff'
        onPress={() => this.onShare(true)} />
    }

  }
  renderAddButtonWatched() {
    let isFavorite = false;
    const { whatchlist, seriesWatched } = this.props;
    whatchlist.map((item) => {
      item.id === this.state.movieDetails.id ? isFavorite = true : null
    })
    return (
      <View style={{ flexDirection: "row", margin: 10 }}>
        <Text style={{ flex: 0.5 }}>{Constants.Strings.TOWHATCH}</Text>
        <Switch onValueChange={this.toggleSwitch}
          disabled={!isFavorite}
          value={this.state.switchValue} />
      </View>)


  }

  onShare = async () => {
    Share.share({
      message: `Acabei de assistir o filme ${this.state.movieDetails.original_title}, usando o aplicativo PraVerDepois`,
      title: 'Confira o filme que acabei de assistir usanto aplicativo PraVerDepois!',

    }, {
      // Android only:
      dialogTitle: 'Compartilhar',
      // iOS only:
      excludedActivityTypes: [
        'com.apple.UIKit.activity.PostToTwitter'
      ]
    })
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header backgroundColor={'#3F51B5'}
          leftComponent={{ icon: 'arrow-back', color: '#fff', size: 30, onPress: () => this.props.navigation.goBack() }}
          centerComponent={<Text style={{ color: 'white', fontWeight: 'bold' }}>{this.state.movieDetails.title}</Text>}
          rightComponent={this.renderAddButtonFavorites()}
        />
        <StatusBar backgroundColor={Constants.Colors.Cyan} barStyle="light-content" />
        {this.state.isLoading ? <Loader show={true} loading={this.state.isLoading} /> : null}
        <ScrollView style={{ backgroundColor: Constants.Colors.Grey }}>
          <View style={Styles.movieCard} >
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
            {this.renderAddButtonWatched()}
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
              <Text >{this.state.movieDetails.overview}</Text>
            </View>
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
const mapStateToProps = state => {
  console.log(state)
  const { whatchlist, seriesWatched } = state.series;
  if (whatchlist === null) {
    return { whatchlist }
  }
  if (seriesWatched === null) {
    return { seriesWatched }
  }
  const keysWhatchlist = Object.keys(whatchlist);
  const seriesWatchWithKeys = keysWhatchlist.map(id => {
    return { ...whatchlist[id] }
  });
  const keysSeriesWatched = Object.keys(seriesWatched);
  const seriesWatchedWithKeys = keysSeriesWatched.map(id => {
    return { ...seriesWatched[id] }
  });

  return {
    whatchlist: seriesWatchWithKeys,
    seriesWatched: seriesWatchedWithKeys
  };
}
export default connect(
  mapStateToProps,
  { addWatchList, watchSeries, addWatchedList }
)(SerieDetail);