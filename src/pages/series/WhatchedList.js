import { View, Text, StatusBar, FlatList, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Image, StyleSheet } from "react-native";
import React, { Component } from "react";
import Loader from "../../util/Loader";
import Constants from "../../util/Constants";
import { Header } from 'react-native-elements'
import { connect } from 'react-redux';
import { watchSeries } from '../../actions';
import SerieCard from '../../components/SerieCard'


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

  render() {
    const { seriesWatched, navigation } = this.props;
    if (seriesWatched === null) {
      return <ActivityIndicator />;
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#263238' }}>
        {this.state.isLoading ? <Loader show={true} loading={this.state.isLoading} /> : null}
        <Header backgroundColor={'#D32F2F'}
          containerStyle={{ borderBottomWidth: 0 }}
          leftComponent={{ icon: 'menu', color: '#fff', size: 30, onPress: () => this.props.navigation.openDrawer() }}
          centerComponent={<Text style={{ color: 'white', fontWeight: 'bold' }}>LISTA JÁ ASSISTIDOS</Text>}
          rightComponent={null}
        />
        {seriesWatched.length ?
          <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: '#263238' }}>
                  <FlatList
                    data={[...seriesWatched]}
                    renderItem={({ item, index }) => (
                      <SerieCard
                        serie={item}
                        isWatched={false}
                        onPress={() => navigation.navigate('SerieDetail', { id: item.id })}
                      />
                    )}
                    keyExtractor={item => item.id}
                    numColumns={3}
                  />
          </ScrollView> : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#263238' }}>
            <Text style={{ color: 'white' }}>Você não assistiu nenhum filme! :(</Text>
          </View>}
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
)(WhatchedList);
