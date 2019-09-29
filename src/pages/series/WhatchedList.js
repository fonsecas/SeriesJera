import { View, Text, StatusBar, TextInput, TouchableOpacity,ActivityIndicator, ScrollView, Image, StyleSheet } from "react-native";
import React, { Component } from "react";
import Loader from "../../util/Loader";
import { callRemoteMethod } from "../../util/WebServiceHandler";
import Constants from "../../util/Constants";
import { renderIf } from "../../util/CommonMethods";
import { customAlert } from "../../util/CommonMethods";
import {Header} from 'react-native-elements'
import firebase from 'firebase';
import { connect } from 'react-redux';
import { watchSeries } from '../../actions';

class WhatchedList extends Component {
  static navigationOptions = {
    headerTitle: Constants.Strings.MAIN_TITLE
  };
  state = {
    movieList: [], 
    isLoading: false, 
    searchText: "", 
    noData: false 
  };

 
  componentDidMount() {
    this.props.watchSeries(false)
  }
  renderList() {
const { seriesWatched} = this.props;
if(seriesWatched){
  return(
    <ScrollView style={Styles.movieList} showsVerticalScrollIndicator={false}>
      <View>
        {seriesWatched.map(function(obj, i) {
          return (
            <TouchableOpacity
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
                    <Text>{Constants.Strings.POPULARITY}</Text>
                    <Text>{obj.popularity} %</Text>
                  </View>
                </View>
              </View>
              <View style={Styles.lineView} />
            </TouchableOpacity>
          );
        }, this)}
      </View>
    </ScrollView>)
}
  }
  render() {
    const { seriesWatched} = this.props;
    if (seriesWatched === null) {
      return <ActivityIndicator />;
    }
   
    return (
      <View style={{ flex: 1, }}>
        {this.state.isLoading ? <Loader show={true} loading={this.state.isLoading} /> : null}
        <Header backgroundColor={'#3F51B5'}
        leftComponent={{ icon: 'menu', color: '#fff', size: 30, onPress: () => this.props.navigation.openDrawer() }}
        centerComponent={<Text style={{color: 'white', fontWeight: 'bold'}}>LISTA JÁ ASSISTIDOS</Text>}
        rightComponent={null}
      />
   
        {/* {renderIf( !seriesWatched.length, 
                   <View style={{flex: 1, justifyContent: 'center',  alignItems: 'center'}}>
                    <Text>Ops.. Parece que você não assistiu nenhum filme ainda! :(</Text>
                    </View>)} */}
        {this.renderList()}
        
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
    console.log('state', state)
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
  )(WhatchedList);
