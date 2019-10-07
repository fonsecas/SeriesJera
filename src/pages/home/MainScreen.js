import { View, StatusBar, TextInput, FlatList, TouchableOpacity, ScrollView, Image, ToastAndroid, StyleSheet } from "react-native";
import React, { Component } from "react";
import Loader from "../../util/Loader";
import { callRemoteMethod } from "../../util/WebServiceHandler";
import Constants from "../../util/Constants";
import { renderIf } from "../../util/CommonMethods";
import { Header, Icon, Rating, Badge, Text } from 'react-native-elements'
import firebase from 'firebase';
import { watchSeries } from '../../actions';
import { connect } from 'react-redux';
import SerieCard from '../../components/SerieCard'
import { Tab, Tabs, TabHeading } from 'native-base';
import SearchBar from "react-native-dynamic-search-bar";
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
    movieListTop: []
  };

  componentDidMount() {
    callRemoteMethod(this, Constants.URL.TOP_FILMS, {}, "searchCallback", "GET", true, 'TOP');
    callRemoteMethod(this, Constants.URL.LANCAMENTO_FIMLS, {}, "searchCallback", "GET", true, 'LACAMENTO');
    callRemoteMethod(this, Constants.URL.POPULAR_FILMS, {}, "searchCallback", "GET", true, 'POPULAR');

    this.props.watchSeries(false);
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
      // callRemoteMethod(this, Constants.URL.TOP_FILMS, {}, "searchCallback", "GET", true);
    }
  };

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
        key: 'SerieDetail'
      })}
    />)

  }
  render() {
    const { seriesWatched } = this.props;
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
                <View><Text style={{ fontFamily: 'Roboto', padding: 5, fontSize: 20, color: '#D32F2F' }}>Filmes</Text>
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
              <Text style={{ fontFamily: 'Roboto', padding: 5, fontSize: 20, color: '#D32F2F' }}>Acabaram de chegar</Text>
              <Text style={{ fontFamily: 'Roboto', paddingLeft: 5, fontSize: 11, color: "white" }}>Lançamentos do cinema</Text>
              <FlatList
                data={[...this.state.movieListLancamento]}
                renderItem={({ item, index }) => (
                  this.renderSerieCard(item)
                )}
                keyExtractor={item => item.id}
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
                keyExtractor={item => item.id}
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
                keyExtractor={item => item.id}
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
const Styles = StyleSheet.create({
  cardView: {
    backgroundColor: "white",
    margin: 10,
    elevation: 5,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
    padding: 5,
    backgroundColor: "#3897f1",
    width: 150,
    borderRadius: 10
  },
  buttonText: { color: "white", margin: 5, alignSelf: "center" },
  lineView: { height: 2, marginTop: 10, backgroundColor: "#EDEDED" },
  movieList: { marginLeft: 10, marginRight: 10, backgroundColor: "white", elevation: 10 },
  image: { width: 120, height: 180, marginLeft: 5, marginRight: 20 },
  rowView: { flexDirection: "row", marginTop: 10 }
})

const mapStateToProps = state => {
  const { seriesWatched } = state.series;
  if (seriesWatched === null) {
    return { seriesWatched }
  }

  const keys = Object.keys(seriesWatched);
  const seriesWatchedWithKeys = keys.map(id => {
    return { ...seriesWatched[id] }
  });
  return { seriesWatched: seriesWatchedWithKeys };
}

export default connect(
  mapStateToProps,
  { watchSeries }
)(MainScreen);