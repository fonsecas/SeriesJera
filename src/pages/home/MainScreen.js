import { View, StatusBar, TextInput, FlatList, TouchableOpacity, ScrollView, Image, ToastAndroid, StyleSheet } from "react-native";
import React, { Component } from "react";
import Loader from "../../util/Loader";
import { callRemoteMethod } from "../../util/WebServiceHandler";
import Constants from "../../util/Constants";
import { renderIf } from "../../util/CommonMethods";
import { Header, Icon, Rating, Badge, Text } from 'react-native-elements'
import firebase from 'firebase';
import { watchSeries, recomendSeries } from '../../actions';
import { connect } from 'react-redux';
import SerieCard from '../../components/SerieCard'
import { Card, CardItem, Left, Right } from 'native-base';

class MainScreen extends Component {
  static navigationOptions = {
    headerTitle: Constants.Strings.MAIN_TITLE
  };
  state = {
    movieList: [],
    isLoading: false,
    searchText: "",
    noData: false,
    switchValue: false,
    watchedList: [],
    tittleBusca: 'POPULARES',
    movieListLancamento: [],
    movieListPopular: [],
    movieListTop: [],
    genresFavorite: 0,
    recomendList: []
  };

  componentDidMount() {
    this.props.watchSeries(false);
    this.props.watchSeries(true);
    callRemoteMethod(this, Constants.URL.TOP_FILMS, {}, "searchCallback", "GET", true, 'TOP');
    callRemoteMethod(this, Constants.URL.LANCAMENTO_FIMLS, {}, "searchCallback", "GET", true, 'LACAMENTO');
    callRemoteMethod(this, Constants.URL.POPULAR_FILMS, {}, "searchCallback", "GET", true, 'POPULAR'); 
   // this.getGenres();
  //  this.props.recomendSeries(this.state.genresFavorite, this.props.seriesWatched, this.props.whatchlist);

  }

  //REALIZA A CONSULTA COM O VALOR DO CAMPO BUSCAR
  searchButtonPressed = () => {
    if (this.state.searchText.length) {
      var endpoint =
        Constants.URL.BASE_URL + Constants.URL.SEARCH_QUERY + this.state.searchText + "&" + Constants.URL.API_KEY + '&language=pt-BR';
      this.setState({ movieList: [] })
      callRemoteMethod(this, endpoint, {}, "searchCallback", "GET", true, 'BUSCA');

    } else {
      this.setState({ movieList: [] })
    }
  };
  //POPULA O RETORNO DA REQUISIÇÃO NO SEU STATE DEFINIDO
  searchCallback(response) {
    if (response.results.length) {
      this.setState({ noData: false });
      switch (response.params) {
        case 'LACAMENTO':
          return this.setState({ movieListLancamento: response.results });
        case 'POPULAR':
          return this.setState({ movieListPopular: response.results });
        case 'TOP':
          return this.setState({ movieListTop: response.results });
        case 'BUSCA':
          return this.setState({ movieList: response.results });
        default:
          return null;
      }

    } else {
      this.setState({ movieList: [], });
      this.setState({ noData: true });
    }
  };

  //LOGOUT DO USUARIO
  logoutUser() {
    firebase.auth().signOut().then(() => {
      this.props.navigation.navigate('LoginPage')
    }).catch(function (error) {

    });
  }
  
  renderSerieCard(item) {
    let isFavorite = false;
    const { seriesWatched, navigation } = this.props;
    seriesWatched.length ? seriesWatched.map((serieWatch) => {
      if (serieWatch.id === item.id) {
        isFavorite = true;
      }
    }) : null;
    return (<SerieCard
      serie={item}
      isWatched={isFavorite}
      onPress={() => navigation.navigate({
        routeName: 'SerieDetail',
        params: { id: item.id },
        key: 'SerieDetail'
      })}
    />)

  }

  getGenres = async () => {
    console.log(this.props.seriesWatched)
    this.setState({ isLoading: true });
          const array = Object.values(this.props.seriesWatched);
          let categorySums = {}
          array.forEach(movie => {
            movie.genres.forEach(genres => {
              categorySums[genres.id] = (categorySums[genres.id] || 0) + 1
            })
          })
          var maior = -Infinity;
          var chave;
          for (var prop in categorySums) {
            // ignorar propriedades herdadas
            if (categorySums.hasOwnProperty(prop)) {
              if (categorySums[prop] > maior) {
                maior = categorySums[prop];
                chave = prop;
              }
            } 
          }
          var chaveInt = parseInt(chave)
          this.setState({genresFavorite: chaveInt})
         // } else {
        //   this.setState({ genresFavorite: [], isLoading: false })
        // }

  };

  render() {
    const { seriesWatched, recomendList } = this.props;
  
    if (seriesWatched === null) {
      return <ActivityIndicator />;
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#263238' }}>
        {this.state.isLoading ? <Loader show={true} loading={this.state.isLoading} /> : null}
        <Header backgroundColor={'#D32F2F'} 
          containerStyle={{ borderBottomWidth: 0 }}
          leftComponent={{ icon: 'menu', underlayColor: '#3897f1', color: '#fff', size: 30, onPress: () => this.props.navigation.openDrawer() }}
          centerComponent={<Text style={{ color: 'white', fontWeight: 'bold' }}>DESCOBRIR</Text>}
          rightComponent={<Icon name='more-vert' underlayColor='#3897f1' type='material' color='#fff'
            onPress={() => ToastAndroid.show('Em breve...', ToastAndroid.LONG, ToastAndroid.TOP)} />}
        />
        {renderIf(this.state.noData, <Text style={{ textAlign: "center" }}>Nenhum filme encontrado.</Text>)}
        {renderIf((this.state.movieListLancamento.length && this.state.movieListTop.length && this.state.movieListPopular.length),

          <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]} style={{ backgroundColor: '#263238' }}>
            <Card borderRadius={30} style={{ marginHorizontal: 10, marginVertical: 10 }}>
              <CardItem borderRadius={30}>
                <TextInput
                  style={{ borderRadius: 20 }}
                  placeholder={Constants.Strings.PLACEHOLDER}
                  onChangeText={text => this.setState({ searchText: text })}
                  underlineColorAndroid={Constants.Colors.Transparent}
                  onSubmitEditing={() => this.searchButtonPressed()}
                />
              </CardItem>
            </Card>
            <View>
              {renderIf(this.state.movieList.length,
                <View>
                  <Text style={{ fontFamily: 'Roboto', padding: 5, fontSize: 20, color: '#D32F2F' }}>Filmes</Text>
                  <Text style={{ fontFamily: 'Roboto', paddingLeft: 5, fontSize: 11, color: "white" }}>Resultados da sua busca</Text>
                  <FlatList
                    data={[...this.state.movieList]}
                    renderItem={({ item, index }) => (
                      this.renderSerieCard(item)
                    )}
                    keyExtractor={item => item.id}
                    horizontal={true}
                  />
                </View>)}
                <Text style={{ fontFamily: 'Roboto', padding: 5, fontSize: 20, color: '#D32F2F' }}>Gêneros</Text>
                  <Text style={{ fontFamily: 'Roboto', paddingLeft: 5, fontSize: 11, color: "white" }}>Descubra pelo seu gênero preferido</Text>
                  <FlatList
                    data={[...Constants.Strings.GENRES]}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('GenresList', [{query: Constants.URL.SEARCH_BY_GENRES+item.id, obj: item}])}>
                        <View style={{paddingVertical: 5,paddingHorizontal: 10, margin: 5, backgroundColor: 'grey', borderRadius: 15}}>
                          <Text style={{color: 'white'}}>{item.name}</Text>
                        </View></TouchableOpacity>
                      )}
                    keyExtractor={item => item.id.toString()}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  />
                  {/* {renderIf(recomendList.length,
                <View>
                  <Text style={{ fontFamily: 'Roboto', padding: 5, fontSize: 20, color: '#D32F2F' }}>Recomendações</Text>
                  <Text style={{ fontFamily: 'Roboto', paddingLeft: 5, fontSize: 11, color: "white" }}>Baseadas no seu perfil</Text>
                  <FlatList
                    data={[...recomendList]}
                    renderItem={({ item, index }) => (
                      this.renderSerieCard(item)
                    )}
                    keyExtractor={item => item.id}
                    horizontal={true}
                  />
                </View>)} */}
              <Text style={{ fontFamily: 'Roboto', padding: 5, fontSize: 20, color: '#D32F2F' }}>Acabaram de chegar</Text>
              <Text style={{ fontFamily: 'Roboto', paddingLeft: 5, fontSize: 11, color: "white" }}>Lançamentos do cinema</Text>
              <FlatList
                data={[...this.state.movieListLancamento]}
                renderItem={({ item, index }) => (
                  this.renderSerieCard(item)
                )}
                keyExtractor={item => item.id.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              />
              <Text style={{ fontFamily: 'Roboto', padding: 5, fontSize: 20, marginTop: 20, color: '#D32F2F' }}>Top Filmes</Text>
              <Text style={{ fontFamily: 'Roboto', paddingLeft: 5, fontSize: 11, color: "white" }}>De todos os tempos</Text>
              <FlatList
                data={[...this.state.movieListTop]}
                renderItem={({ item, index }) => (
                  this.renderSerieCard(item)
                )}
                keyExtractor={item => item.id.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}

              />
              <Text style={{ fontFamily: 'Roboto', padding: 5, fontSize: 20, marginTop: 20, color: '#D32F2F' }}>Populares</Text>
              <Text style={{ fontFamily: 'Roboto', paddingLeft: 5, fontSize: 11, color: "white" }}>Sucessos imperdíveis</Text>
              <FlatList
                data={[...this.state.movieListPopular]}
                renderItem={({ item, index }) => (
                  this.renderSerieCard(item)
                )}
                keyExtractor={item => item.id.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}

              />

            </View>
          </ScrollView>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { seriesWatched, recomendList, whatchlist } = state.series;

  return { seriesWatched: seriesWatched,
            recomendList: recomendList,
             whatchlist: whatchlist}; 
} 
 
export default connect(
  mapStateToProps,
  { watchSeries, recomendSeries }
)(MainScreen);