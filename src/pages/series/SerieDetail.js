import { View, Text, StatusBar, FlatList, Linking, TouchableOpacity, ImageBackground, ScrollView, Image, ToastAndroid, StyleSheet, Switch, Share } from "react-native";
import React, { Component } from "react";
import Constants from "../../util/Constants";
import { callRemoteMethod } from "../../util/WebServiceHandler";
import Loader from "../../util/Loader";
import { Header, Icon, Badge, Button } from 'react-native-elements'
import { addWatchList, watchSeries, addWatchedList } from '../../actions';
import { connect } from 'react-redux';
import { SliderBox } from 'react-native-image-slider-box';
import SerieCard from '../../components/SerieCard';




class SerieDetail extends Component {
  static navigationOptions = {
    headerTitle: Constants.Strings.SECONDARY_TITLE,
    headerRight: <View />
  };

  state = {
    movieDetails: {},
    movieImages: [],
    arrayImages: [],
    arrayCredits: [],
    isLoading: false,
    whatchlist: [],
    isFavorite: false,
    switchValue: false,
    seriesWatched: [],
    movieSimilar: [],
    arrayVideos: []
  };

  componentDidMount() {
    this.getMovieDetails();
    this.props.watchSeries(true)
    this.props.watchSeries(false)
  }

  //BUSCA OS DETALHES DO FILME NA API TMDB
  getMovieDetails = () => {
    var endpoint = Constants.URL.BASE_URL + "movie/" + this.props.navigation.state.params.id + "?" + Constants.URL.API_KEY + '&language=pt-BR';
    callRemoteMethod(this, endpoint, {}, "getMovieDetailsCallback", "GET", true, 'DETAIL');
    callRemoteMethod(this, Constants.URL.BASE_URL_MOVIE + this.props.navigation.state.params.id + '/similar?' + Constants.URL.API_KEY + '&language=pt-BR', {}, "getMovieDetailsCallback", "GET", true, 'SIMILAR');
    callRemoteMethod(this, Constants.URL.IMAGE_BANNER_URL + this.props.navigation.state.params.id + '/images?' + Constants.URL.API_KEY, {}, "getMovieDetailsCallback", "GET", true, 'IMAGES');
    callRemoteMethod(this, Constants.URL.IMAGE_BANNER_URL + this.props.navigation.state.params.id + '/videos?' + Constants.URL.API_KEY + '&language=pt-BR', {}, "getMovieDetailsCallback", "GET", true, 'VIDEOS');
    callRemoteMethod(this, Constants.URL.IMAGE_BANNER_URL + this.props.navigation.state.params.id + '/credits?' + Constants.URL.API_KEY, {}, "getMovieDetailsCallback", "GET", true, 'CREDITS');

  };
  //SETA OS DETALHES DO FILME
  getMovieDetailsCallback = response => {
    switch (response.params) {
      case 'IMAGES':
        return this.setState({ movieImages: response.backdrops }), this.renderImages();;
      case 'DETAIL':
        this.setState({ movieDetails: response })
        const { seriesWatched } = this.props;
        let isWatched = false;
        seriesWatched.map((item) => {
          item.id === this.state.movieDetails.id ? isWatched = true : null
        })
        return this.setState({ switchValue: isWatched });
      case 'SIMILAR':
        return this.setState({ movieSimilar: response.results });
      case 'VIDEOS':
        return this.setState({ arrayVideos: response.results });
      case 'CREDITS':
        return this.setState({ arrayCredits: response.cast });
      default:
        return null;
    }
  };

  //RENDERIZA O BOTÃO DE ADICIONAR/REMOVER DA LISTA PARA ASSISTIR
  renderAddButtonFavorites() {

    let isFavorite = false;
    const { whatchlist } = this.props;
    whatchlist.map((item) => {
      item.id === this.state.movieDetails.id ? isFavorite = true : null
    })

    if (!this.state.switchValue) {
      return (isFavorite ?
        <Button
          buttonStyle={{ margin: 5, borderColor: '#D32F2F' }}
          titleStyle={{ color: '#D32F2F' }}
          icon={<Icon name='delete-sweep'
            type='material'
            color='#D32F2F'
            containerStyle={{ marginHorizontal: 10 }} />}
          type="outline"
          title="Remover da lista"
          onPress={() => {
            this.setState({ isFavorite: false })
            this.props.addWatchList(false, this.state.movieDetails, true).then(() => {
              ToastAndroid.show(
                'Removido da lista',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
              );
              
            }); isFavorite = false
          }}
        /> :
        <Button 
          buttonStyle={{ margin: 5, borderColor: '#D32F2F' }}
          titleStyle={{ color: '#D32F2F' }}
          icon={<Icon name='playlist-add'
            type='material'
            color='#D32F2F'
            containerStyle={{ marginHorizontal: 10 }} />}
          type="outline"
          title="Adicionar na lista"
          onPress={() => this.props.addWatchList(true, this.state.movieDetails).then(() => {
            ToastAndroid.show(
              'Marcado para assistir',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
          })}
        />)
    } else {
      return <Button
        buttonStyle={{ margin: 5, borderColor: '#D32F2F' }}
        titleStyle={{ color: '#D32F2F' }}
        icon={<Icon name='share'
          type='material'
          color='#D32F2F'
          containerStyle={{ marginHorizontal: 10 }} />}
        type="outline"
        title="Compartilhar"
        onPress={() => this.onShare(true)}
      />
    }


  }
  //RENDERIZA O BOTÃO DE ADICIONAR/REMOVER DA LISTA JÁ ASSISTIDOS
  renderAddButtonWatched() {
    let isFavorite = false;
    const { whatchlist, seriesWatched } = this.props;
    whatchlist.map((item) => {
      item.id === this.state.movieDetails.id ? isFavorite = true : null
    })
    if (!this.state.isLoading) {
      return (
        <View style={{ flexDirection: "row", margin: 10 }}>
          <Text style={{ flex: 0.5, color: '#D32F2F', fontWeight: 'bold' }}>{Constants.Strings.TOWHATCH}</Text>
          <Switch onValueChange={this.toggleSwitch}
            trackColor={{ true: '#D32F2F', false: 'grey' }}
            disabled={!isFavorite}
            value={this.state.switchValue} />
        </View>)

    }
  }
  //CHAMA A FUNÇÃO DE COMPARTILHAMENTO
  onShare = async () => {
    Share.share({
      message: `Acabei de assistir o filme ${this.state.movieDetails.original_title}, usando o aplicativo PraVerDepois`,
      title: 'Confira o filme que acabei de assistir usanto aplicativo PraVerDepois!',

    }, {
      dialogTitle: 'Compartilhar',
      excludedActivityTypes: [
        'com.apple.UIKit.activity.PostToTwitter'
      ]
    })
  };

  //FUNÇÃO QUE ALTERA O ESTADO DO TOOGLEBUTTOM (ASSISTIDOS)
  toggleSwitch = (value) => {
    this.props.addWatchedList(this.state.movieDetails).then(() => {
      this.props.addWatchList(false, this.state.movieDetails, true)
    })
    this.setState({ switchValue: value })
  }
  //GERENCIA AS IMAGENS NO BANNER DE FUNDO 
  renderImages = async () => {
    let arrayImages = []
    {
      this.state.movieImages.length ?
        this.state.movieImages.map((image, index) => {
          if (index <= 4) {
            arrayImages.push(Constants.URL.IMAGE_SINGLE_URL + image.file_path)
          }
        }) : null
    }
    this.setState({ arrayImages: arrayImages })
  }
  renderSerieCard(item) {
    let isFavorite = false;
    const { seriesWatched, navigation } = this.props;
    seriesWatched.map((serieWatch) => {
      if (serieWatch.id === item.id) {
        isFavorite = true;
      }
    })
    return (<SerieCard
      serie={item}
      isWatched={isFavorite}
      onPress={() => navigation.navigate({
        routeName: 'SerieDetail',
        params: { id: item.id },
        key: 'SerieDetail' + item.id
      })}
    />)

  }
  render() {
    console.log(this.state)
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#263238' }}>
        {this.state.isLoading ? <Loader show={true} loading={this.state.isLoading} /> : null}
        <ImageBackground source={{ uri: this.state.arrayImages[Math.floor(Math.random() * 5)] }} style={{ backgroundColor: '#f9f9f9', width: '100%', height: 350 }}>
          <View style={{ flexDirection: 'row', flex: 2, paddingTop: 100, backgroundColor: 'rgba(0,0,0, 0.60)' }}>
            <Image
              style={Styles.image}
              source={{
                uri:
                  this.state.movieDetails.poster_path != null
                    ? Constants.URL.IMAGE_URL + this.state.movieDetails.poster_path
                    : Constants.URL.PLACEHOLDER_IMAGE
              }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 30,
                fontFamily: 'Roboto',
                margin: 5,
                color: 'white',
              }}>{this.state.movieDetails.title}</Text>
              {this.state.movieDetails.release_date ? <View style={{ flexDirection: 'row' }}>
                <View style={{ margin: 5, flexDirection: 'row', borderRadius: 15, backgroundColor: '#607D8B', borderColor: "#607D8B", alignSelf: 'flex-start', alignContent: 'center', justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 5 }}>
                  <Text style={{ color: '#FFF' }}>{this.state.movieDetails.release_date.split("-", 1)}</Text>
                </View>
                {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('GenresList', this.state.movieDetails.genres[0])}> */}
                  <View style={{ margin: 5, flexDirection: 'row', borderRadius: 15, backgroundColor: '#607D8B', borderColor: "#607D8B", alignSelf: 'flex-start', alignContent: 'center', justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 5 }}>
                    <Text style={{ color: '#FFF' }}>{this.state.movieDetails.genres[0].name}</Text>
                  </View>
              {/* //  </TouchableOpacity> */}
                <View style={{ margin: 5, flexDirection: 'row', borderRadius: 15, backgroundColor: '#607D8B', borderColor: "#607D8B", alignSelf: 'flex-start', alignContent: 'center', justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 5 }}>
                  <Icon name='star' type='material' size={15} color="#FFDF00" containerStyle={{ marginRight: 3, paddingTop: 2 }} /><Text style={{ color: '#FFF' }}>{this.state.movieDetails.vote_average}</Text>
                </View>
              </View> : null}

            </View>
          </View>
        </ImageBackground>
        {!this.state.isLoading ?
          <View style={{ flexDirection: 'row', flex: 2 }}>

            <View style={{ flex: 1 }}>
              {this.renderAddButtonFavorites()}
            </View>
            <View style={{ flex: 1 }}>
              <Button
                buttonStyle={{ margin: 5, borderColor: '#D32F2F' }}
                titleStyle={{ color: '#D32F2F' }}
                icon={<Icon name='live-tv'
                  type='material'
                  color='#D32F2F'
                  containerStyle={{ marginHorizontal: 10 }} />}
                type="outline"
                title="Ver Trailer"
                onPress={() => this.state.arrayVideos.length ? Linking.openURL('https://www.youtube.com/watch?v=' + this.state.arrayVideos[0].key) : ToastAndroid.show('Nenhum trailer encontrado', ToastAndroid.SHORT, ToastAndroid.CENTER)}
              />
            </View>

          </View>
          : null}

        {this.renderAddButtonWatched()}
        {!this.state.isLoading ?
          <View><View style={{ margin: 10 }}>
            <Text style={{ flex: 0.2, color: '#D32F2F', fontWeight: 'bold' }}>{Constants.Strings.OVERVIEW.toUpperCase()}</Text>
          </View>
            <View style={{ margin: 10 }}>
              <Text style={{ color: 'white', textAlign: 'justify' }}>{this.state.movieDetails.overview}</Text>
            </View>
            <View style={{ margin: 10 }}>
              <Text style={{ flex: 0.2, color: '#D32F2F', fontWeight: 'bold' }}>{Constants.Strings.CASTS.toUpperCase()}</Text>
            </View>
            <View style={{ margin: 10 }}>
              <FlatList
                data={[...this.state.arrayCredits]}
                renderItem={({ item, index }) => (
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('GenresList', [{query: Constants.URL.WITH_CAST_FILMES+item.id, obj : item}])}>
                    <Image source={{ uri: Constants.URL.IMAGE_URL + item.profile_path }}
                      style={{ backgroundColor: '#f9f9f9', width: 70, height: 70, borderRadius: 50, marginHorizontal: 13 }} />
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: item.name.length <= 20 ? 12 : 10 }}>{item.name}</Text>
                  </TouchableOpacity>)}
                keyExtractor={item => item.id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              />
            </View>

            <Text style={{ fontFamily: 'Roboto', padding: 5, fontSize: 20, color: '#D32F2F' }}>Filmes Semelhantes</Text>
            <Text style={{ fontFamily: 'Roboto', paddingLeft: 5, fontSize: 11, color: "white" }}>Parecidos com o que está vendo</Text>
            <FlatList
              data={[...this.state.movieSimilar]}
              renderItem={({ item, index }) => (
                this.renderSerieCard(item)
              )}
              keyExtractor={item => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />

          </View> : null}


      </ScrollView>
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
  image: {
    width: 160,
    height: 220,
    marginLeft: 5,
    //flex: 1,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 3,
    bottom: 0,
  }
})
const mapStateToProps = state => {
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