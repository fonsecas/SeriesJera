import { View, Text, StatusBar, TextInput, TouchableOpacity, ScrollView,FlatList, ActivityIndicator, Image, StyleSheet } from "react-native";
import React, { Component } from "react";
import Loader from "../../util/Loader";
import { callRemoteMethod } from "../../util/WebServiceHandler";
import Constants from "../../util/Constants";
import { renderIf } from "../../util/CommonMethods";
import { customAlert } from "../../util/CommonMethods";
import { Header } from 'react-native-elements'
import firebase from 'firebase';
import { watchSeries } from '../../actions';
import { connect } from 'react-redux'; 
import SerieCard from '../../components/SerieCard'

class WatchList extends Component {
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
    this.props.watchSeries(true)
  }

  render() {
    const { series, navigation  } = this.props;
    console.log(series)
    if (series === null) {
      return <ActivityIndicator />;
    }
    return (
      <View style={{ flex: 1, }}>
        {this.state.isLoading ? <Loader show={true} loading={this.state.isLoading} /> : null}
        <Header backgroundColor={'#3897f1'}
          leftComponent={{ icon: 'menu', color: '#fff', size: 30, onPress: () => this.props.navigation.openDrawer() }}
          centerComponent={<Text style={{ color: 'white', fontWeight: 'bold' }}>LISTA PARA ASSISTIR</Text>}
          rightComponent={null}
        />
        {renderIf(!series.length,
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Você está em dia com seus filmes! :)</Text>
          </View>)}
        {renderIf(
          series.length,
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{flex: 1, justifyContent: 'center'}}>
            <FlatList
                  data={[...series]}
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
            </View>
          </ScrollView>
        )}
      </View>
    );
  }
}
const mapStateToProps = state => {
  const { whatchlist } = state.series;
  if (whatchlist === null) {
    return { whatchlist }
  }

  const keys = Object.keys(whatchlist);
  const seriesWithKeys = keys.map(id => {
    return { ...whatchlist[id] }
  });
  return { series: seriesWithKeys };
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
export default connect(
  mapStateToProps,
  { watchSeries }
)(WatchList);
