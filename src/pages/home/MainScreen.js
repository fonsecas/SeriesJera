import { View, Text, StatusBar, TextInput, TouchableOpacity, ScrollView, Image, ToastAndroid, StyleSheet } from "react-native";
import React, { Component } from "react";
import Loader from "../../util/Loader";
import { callRemoteMethod } from "../../util/WebServiceHandler";
import Constants from "../../util/Constants";
import { renderIf } from "../../util/CommonMethods";
import { customAlert } from "../../util/CommonMethods";
import {Header, Icon, Rating, Badge} from 'react-native-elements'
import firebase from 'firebase';

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
    
  }
  //Função para pesquisar a consulta inserida
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

  //Callback do searchButtonPressed()  
  searchCallback = response => {
    if (response.results.length) {
      this.setState({ noData: false });
      this.getSeriesWatched();
      this.setState({ movieList: response.results });
      
    } else {
      this.setState({ movieList: [] });
      this.setState({ noData: true });
    }
  };
  logoutUser()  {

      firebase.auth().signOut().then(() => {
        console.log('desconectado')
        this.props.navigation.navigate('LoginPage') 
        
      }).catch(function(error) {
        // An error happened.
      });
    }
    getSeriesWatched = async () => {
      const { currentUser } = firebase.auth();
      await firebase
        .database()
        .ref(`/users/${currentUser.uid}/`)
        .on('value', snapshot => {
          const result = snapshot.val()
          const { seriesWatched } = result;
  
          if (seriesWatched) {
            const array = Object.values(seriesWatched);
            
            this.setState({ watchedList: array })
          } else {
            this.setState({ watchedList: [] })
  
          }
        })
  
    };

  render() {
    console.log(this.state.movieList)
    return (
      <View style={{ flex: 1 }}>
        {this.state.isLoading ? <Loader show={true} loading={this.state.isLoading} /> : null}
        <Header backgroundColor={'#3F51B5'}
        leftComponent={{ icon: 'menu', underlayColor: '#3F51B5', color: '#fff', size: 30, onPress: () => this.props.navigation.openDrawer() }}
        centerComponent={<Text style={{color: 'white', fontWeight: 'bold'}}>DESCOBRIR</Text>}
        rightComponent={<Icon name='more-vert' underlayColor='#3F51B5' type='material' color='#fff' 
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
         <ScrollView style={Styles.movieList} showsVerticalScrollIndicator={false}>
            <View>
              {this.state.movieList.map(function(obj, i) {
                let isFavorite = false;
                this.state.watchedList.map((item) => {
                  if (item.id === obj.id) {
                    isFavorite = true;
                  }
                })
                return (
                  <TouchableOpacity
                   activeOpacity={1}
                    onPress={() => this.props.navigation.navigate("SerieDetail", { id: obj.id })}
                    key={i}
                    style={{ margin: 10, marginBottom: 5 }}>
                    <View style={{ flexDirection: "row" }}>
                      <Image
                        style={Styles.image}
                        source={{
                          uri:
                            obj.poster_path != null
                              ? Constants.URL.IMAGE_URL + obj.poster_path
                              : Constants.URL.PLACEHOLDER_IMAGE
                        }}
                      />
                      <View style={{ flexDirection: "column" }}>
                        <Text numberOfLines={3} style={{ fontSize: 17 }}>
                          {obj.original_title}
                        </Text>
                        <View style={Styles.rowView}>
                          <Text>{Constants.Strings.RELEASE_DATE}</Text>
                          <Text>{obj.release_date}</Text>
                        </View>
                        <View style={Styles.rowView}>
                          <Text>{Constants.Strings.LANGUAGE}</Text>
                          <Text>{obj.original_language}</Text>
                        </View>
                        <View style={Styles.rowView}>
                          <Text>{Constants.Strings.RATINGS}</Text>
                          <Rating imageSize={20} readonly startingValue={(obj.vote_average/10)*5}/>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 10, alignItems: 'flex-end' }}>
                            {isFavorite ? <Badge badgeStyle={{paddingHorizontal: 5, paddingVertical: 10}}value="Assistido" status="success" /> : null}
                        </View>
                      </View>
                    </View>
                    <View style={Styles.lineView} />
                  </TouchableOpacity>
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
    backgroundColor: "#3F51B5",
    width: 150,
    borderRadius: 10
  },
  buttonText: { color: "white", margin: 5, alignSelf: "center" },
  lineView: { height: 2, marginTop: 10, backgroundColor: "#EDEDED" },
  movieList: { marginLeft: 10, marginRight: 10, backgroundColor: "white", elevation: 10 },
  image: { width: 120, height: 180, marginLeft: 5, marginRight: 20 },
  rowView: { flexDirection: "row", marginTop: 10 }
})

export default MainScreen;