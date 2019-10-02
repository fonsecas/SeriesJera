import { View, Text, StatusBar, TextInput,FlatList, TouchableOpacity, ScrollView, Image, ToastAndroid, StyleSheet } from "react-native";
import React, { Component } from "react";
import Loader from "../../util/Loader";
import { callRemoteMethod } from "../../util/WebServiceHandler";
import Constants from "../../util/Constants";
import { renderIf } from "../../util/CommonMethods";
import {Header, Icon, Rating, Badge} from 'react-native-elements'
import firebase from 'firebase';
import { watchSeries } from '../../actions';
import { connect } from 'react-redux';
import SerieCard from '../../components/SerieCard'

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
    tittleBusca: 'POPULARES'
  };

  componentDidMount(){
    callRemoteMethod(this, Constants.URL.POPULAR_FILMS, {}, "searchCallback", "GET", true);
    this.props.watchSeries(false);
  }

  //REALIZA A CONSULTA COM O VALOR DO CAMPO BUSCAR
  searchButtonPressed = () => {
    if (this.state.searchText.length) {
      var endpoint =
        Constants.URL.BASE_URL + Constants.URL.SEARCH_QUERY + this.state.searchText + "&" + Constants.URL.API_KEY;
        this.setState({movieList: [], tittleBusca: 'RESULTADO BUSCA'})
        callRemoteMethod(this, endpoint, {}, "searchCallback", "GET", true);
      
    } else {
      this.setState({movieList: [], tittleBusca: 'POPULARES'})
      callRemoteMethod(this, Constants.URL.POPULAR_FILMS, {}, "searchCallback", "GET", true);
    }
  };

  //PEGA O RETORNO DA CONSULTA DE BUSCA E POPULA NO STATE
  searchCallback = response => {
    if (response.results.length) {
      this.setState({ noData: false });
     // this.getSeriesWatched();
      this.setState({ movieList: response.results });
      
    } else {
      this.setState({ movieList: [] });
      this.setState({ noData: true });
    }
  };
  //LOGOUT DO USUARIO
  logoutUser()  {
      firebase.auth().signOut().then(() => {
        this.props.navigation.navigate('LoginPage')       
      }).catch(function(error) {

      });
    }
      renderSerieCard(item) {
        let isFavorite = false;
        const { seriesWatched, navigation} = this.props;
        seriesWatched.map((serieWatch) => {
          if (serieWatch.id === item.id) {
            isFavorite = true;
          }
        })
      return (<SerieCard
      serie={item}
      isWatched={isFavorite}
      onPress={() => navigation.navigate('SerieDetail', { id: item.id })}
    />)
   
      }
  render() {
    const { seriesWatched} = this.props;
    if (seriesWatched === null) {
      return <ActivityIndicator />;
    }
   
    return (
      <View style={{ flex: 1 }}>
        {this.state.isLoading ? <Loader show={true} loading={this.state.isLoading} /> : null}
        <Header backgroundColor={'#3897f1'}
        leftComponent={{ icon: 'menu', underlayColor: '#3897f1', color: '#fff', size: 30, onPress: () => this.props.navigation.openDrawer() }}
        centerComponent={<Text style={{color: 'white', fontWeight: 'bold'}}>DESCOBRIR</Text>}
        rightComponent={<Icon name='more-vert' underlayColor='#3897f1' type='material' color='#fff' 
        onPress={() => ToastAndroid.show('Em breve...', ToastAndroid.LONG, ToastAndroid.TOP)} />}
      />
        <StatusBar backgroundColor={Constants.Colors.Cyan} barStyle="light-content" />
        <View style={{ backgroundColor: Constants.Colors.Grey }}>
          <View style={Styles.cardView}>
            <View style={{ margin: 10 }}>
              <TextInput 
                placeholder={Constants.Strings.PLACEHOLDER}
                onChangeText={text => this.setState({ searchText: text })}
                underlineColorAndroid={Constants.Colors.Transparent}
              />
              <View style={{ height: 1, backgroundColor: Constants.Colors.Grey, margin: 0 }} />
            </View>
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity onPress={() => this.searchButtonPressed()} style={Styles.buttonContainer}>
                <Text style={Styles.buttonText}>{Constants.Strings.SEARCH_BUTTON}</Text>
              </TouchableOpacity>
            </View>
          </View>
          {renderIf(
          this.state.movieList.length,
          <Text style={{textAlign: 'center', fontWeight: 'bold', paddingTop: 10, paddingBottom: 10, fontSize: 16,}}>{this.state.tittleBusca}</Text>
          )}
          </View>
        
        {renderIf(this.state.noData, <Text style={{ textAlign: "center" }}>Nenhum filme encontrado.</Text>)}
        {renderIf(
          this.state.movieList.length,
          
         <ScrollView showsVerticalScrollIndicator={false}>
            <View>
           
            <FlatList
                  data={[...this.state.movieList]}
                  renderItem={({ item, index }) => (
                  
                      this.renderSerieCard(item)
                  )}
                  keyExtractor={item => item.id}
                  numColumns={2}
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
    elevation: 5
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
    return { ...seriesWatched[id]}
  });
  return { seriesWatched: seriesWatchedWithKeys };
}

export default connect(
  mapStateToProps,
  { watchSeries }
)(MainScreen);