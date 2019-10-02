import { View, Text, StatusBar, TextInput,FlatList, TouchableOpacity, ScrollView, Image, StyleSheet, TouchableHighlightBase } from "react-native";
import React, { Component } from "react";
import Loader from "../../util/Loader";
import { callRemoteMethod } from "../../util/WebServiceHandler";
import Constants from "../../util/Constants";
import { renderIf } from "../../util/CommonMethods";
import { addWatchList, watchSeries, addWatchedList } from '../../actions';
import { Header } from 'react-native-elements'
import firebase from 'firebase';
import { connect } from 'react-redux';
import SerieCard from '../../components/SerieCard'


class RecomendList extends Component {
  static navigationOptions = {
    headerTitle: Constants.Strings.MAIN_TITLE
  };
  state = {
    recomendList: [],
    watchedList: [],
    whatchlist: [],
    isLoading: false,
    searchText: "",
    noData: false,
    genresFavorite: ''
  };


  componentDidMount() {

    this.getGenres();
    callRemoteMethod(this, Constants.URL.RECOMEND_FIMLS + this.state.genresFavorite, {}, "searchCallback", "GET", true);
    this.props.watchSeries(true)
    this.props.watchSeries(false)


  }
  searchCallback = response => {
    if (response.results.length) {
      this.setState({ noData: false });
      console.log
      let array = []

      response.results.map(recomend => {
        let itExist = false;
        this.props.whatchlist.map(watch => {
          console.log(recomend.id, '-', watch.id)
          if (recomend.id === watch.id) {
            itExist = true
            return true
          }
          this.props.seriesWatched.map(watched => {
            if (recomend.id === watched.id) {
              itExist = true
              return true
            }
          })
        })
        console.log(itExist)
        !itExist ? array.push(recomend) : null
      })

      this.setState({ recomendList: array });
      console.log('entrou aqui', array)

    } else {
      this.setState({ recomendList: [] });
      this.setState({ noData: true });

    }
  };
  //Função para buscar a lista dos filmes favoritos do usuario
  getGenres = async () => {
    this.setState({ isLoading: true });
    const { currentUser } = firebase.auth();
    await firebase
      .database()
      .ref(`/users/${currentUser.uid}/`)
      .on('value', snapshot => {
        const result = snapshot.val()
        const { whatchlist } = result
        if (whatchlist) {
          ;
          const array = Object.values(whatchlist);

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
          this.setState({ genresFavorite: chave, isLoading: false })
        } else {
          this.setState({ genresFavorite: [], isLoading: false })
        }
      })
  };

  render() {
    console.log(this.props)
    return (
      <View style={{ flex: 1, }}>
        {this.state.isLoading ? <Loader show={true} loading={this.state.isLoading} /> : null}
        <Header backgroundColor={'#3897f1'}
          leftComponent={{ icon: 'menu', color: '#fff', size: 30, onPress: () => this.props.navigation.openDrawer() }}
          centerComponent={<Text style={{ color: 'white', fontWeight: 'bold' }}>RECOMENDAMOS</Text>}
          rightComponent={null}
        />
        {renderIf(!this.state.recomendList.length,
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Você está em dia com seus filmes! :)</Text>
          </View>)}
        {renderIf(
          this.state.recomendList.length,
          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
              {this.state.recomendList.map(function (obj, i) {
                return (
                  <FlatList
                  data={[...this.state.recomendList]}
                  renderItem={({ item, index }) => (
                  <SerieCard
                        serie={item}
                        isWatched={false}
                        onPress={() => navigation.navigate('SerieDetail', { id: item.id })}
                      />
                  )}
                  keyExtractor={item => item.id}
                  numColumns={2}
                />
                );
              }, this)}
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
    elevation: 5
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
    padding: 5,
    backgroundColor: "#02ADAD",
    width: 80,
    borderRadius: 10
  },
  buttonText: { color: "white", margin: 5, alignSelf: "center" },
  lineView: { height: 2, marginTop: 10, backgroundColor: "#EDEDED" },
  movieList: { marginLeft: 10, marginRight: 10, backgroundColor: "white", elevation: 10 },
  image: { width: 120, height: 180, marginLeft: 5, marginRight: 20 },
  rowView: { flexDirection: "row", marginTop: 10 }
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
)(RecomendList);