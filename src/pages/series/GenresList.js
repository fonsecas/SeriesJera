import { View, Text, ScrollView, FlatList, ActivityIndicator} from "react-native";
import React, { Component } from "react";
import Loader from "../../util/Loader";
import { callRemoteMethod } from "../../util/WebServiceHandler";
import Constants from "../../util/Constants";
import { Header } from 'react-native-elements'
import { watchSeries } from '../../actions';
import { connect } from 'react-redux';
import SerieCard from '../../components/SerieCard';

class GenresList extends Component {
 
  static navigationOptions = {
    headerTitle: Constants.Strings.MAIN_TITLE
  };
  
  state = {
    movieList: [],
    isLoading: false,
    searchText: "",
    noData: false,
    page: 1
  };


  componentDidMount() {
    callRemoteMethod(this, Constants.URL.SEARCH_BY_GENRES + this.props.navigation.state.params.id + '&page=' + this.state.page, {}, "searchCallback", "GET", true);

  }
  searchCallback = response => {
      if(response.results){
          this.setState({movieList : [...this.state.movieList, ...response.results]})
      }
      console.log(this.state.movieList)
      console.log(this.state.page)
  }
  _loadRepositories = async () => {
    this.setState({page : this.state.page + 1})
    callRemoteMethod(this, Constants.URL.SEARCH_BY_GENRES + this.props.navigation.state.params.id + '&page=' + (this.state.page + 1), {}, "searchCallback", "GET", true);
  }
  render() {
 
    const {  navigation } = this.props;
    console.log(this.state.movieList)
    if (this.state.movieList === null) {
      return <ActivityIndicator />;
    }
    return (
      <View style={{ flex: 1, backgroundColor: '#263238' }}>
        {this.state.isLoading ? <Loader show={true} loading={this.state.isLoading} /> : null}
        <Header backgroundColor={'#D32F2F'}
          containerStyle={{ borderBottomWidth: 0 }}
          leftComponent={{ icon: 'arrow-back', color: '#fff', size: 30, onPress: () => this.props.navigation.goBack() }}
          centerComponent={<Text style={{ color: 'white', fontWeight: 'bold' }}>{navigation.state.params.name.toUpperCase()}</Text>}
          rightComponent={null}
        />
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <FlatList
                data={[...this.state.movieList]} 
                renderItem={({ item, index }) => (
                  <SerieCard
                    serie={item}
                    isWatched={false}
                    onPress={() => navigation.navigate('SerieDetail', { id: item.id })}
                  />
                )}
                keyExtractor={item => item.id}
                numColumns={3}
                onEndReached={this._loadRepositories}
                onEndReachedTresholf={0.03}
              />
            </View>
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

export default connect(
  mapStateToProps,
  { watchSeries }
)(GenresList);
