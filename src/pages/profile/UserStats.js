import { View, Text,ActivityIndicator, Dimensions } from "react-native";
import React, { Component } from "react";
import Loader from "../../util/Loader";
import Constants from "../../util/Constants";
import { Header, Card } from 'react-native-elements'
import { connect } from 'react-redux';
import { watchSeries } from '../../actions';
import firebase from 'firebase';
import { PieChart } from "react-native-chart-kit";

class UserStats extends Component {

  state = {
    movieList: [],
    isLoading: false,
    ano: '',
    mes: '',
    dia: '',
    hora: '',
    minuto: '',
    segundo: '',
    genresFavorite: [],
    totalSerie: [],
    totalAssistido: []
  };


  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {

      this.props.watchSeries(false)
    this.getRuntime()
    this.getGenres();

  });
    
  }

  getRuntime() {
    const { seriesWatched } = this.props;
    console.log(seriesWatched)
    let totalTime = 0
    seriesWatched.map((item) => {
      totalTime = totalTime + item.runtime;
    })

    this.calcula(totalTime)
  }

  calcula(valorInicio) {
    //primeiro criei constantes para armazenar os valores dos tempos em MINUTOS. altere eles de acordo com sua necessidade
    const minutos = 1;
    const horas = 60; //minuto * 60
    const dias = 1440; //hora * 24
    const semanas = 10080; //dias * 7
    const meses = 302400; //semanas * 4
    const anos = 3628800; //meses * 12

    if (valorInicio > anos) {//verifica se é maior que um ano
      var ano = Math.floor(valorInicio / anos); //cria a variável ano e armazena a quantidade de anos nela
      valorInicio = valorInicio - (anos * ano); //atualiza o valorInicio
    } else {
      var ano = 0; //se for menor que um ano, cria a variável ano e deixa zerada
    }

    //faz o mesmo para os meses
    if (valorInicio > meses) {
      var mes = Math.floor(valorInicio / meses);
      valorInicio = valorInicio - (meses * mes);
    } else {
      var mes = 0;
    }

    //faz o mesmo para as semanas
    if (valorInicio > semanas) {
      var semana = Math.floor(valorInicio / semanas);
      valorInicio = valorInicio - (semanas * semana);
    } else {
      var semana = 0;
    }

    //faz o mesmo para os dias
    if (valorInicio > dias) {
      var dia = Math.floor(valorInicio / dias);
      valorInicio = valorInicio - (dias * dia);
    } else {
      var dia = 0;
    }

    //faz o mesmo para os horas
    if (valorInicio > horas) {
      var hora = Math.floor(valorInicio / horas);
      valorInicio = valorInicio - (horas * hora);
    } else {
      var hora = 0;
    }


    var minuto = valorInicio; //o que sobra são minutos
    this.setState({
      ano: ano,
      mes: mes,
      dia: dia,
      hora: hora,
      minuto: minuto
    })
    console.log('Anos: ' + ano + ' - Meses: ' + mes + ' - Semanas: ' + semana + ' - Dias: ' + dia + ' - Horas: ' + hora + ' - Minuto: ' + minuto);
    //os resultados são as variáveis criadas, adapte o código de acordo com sua necessidade
  }

  getGenres = async () => {
    this.setState({ isLoading: true });
    const { currentUser } = firebase.auth();
    await firebase
      .database()
      .ref(`/users/${currentUser.uid}/`)
      .on('value', snapshot => {
        const result = snapshot.val()
        const { seriesWatched } = result
        if (seriesWatched) {

          const array = Object.values(seriesWatched);
          console.log('array',array)
          let categorySums = []
          array.forEach(movie => {
             categorySums[movie.genres[0].id] = (categorySums[movie.genres[0].id] || 0) + 1
          })

         console.log(categorySums)
         let genres = Constants.Strings.GENRES;
         let totalSerie = []
          for (var prop in categorySums) {
            let porcent = 100*(categorySums[prop]/array.length)

           genres.some((item) => {

             if(item.id == prop) {
              totalSerie.push({name: item.name,
                total: porcent,
                 color: item.color,
                 legendFontColor: 'white'})
                 return true
             }
            
           })
          }
          this.setState({ totalAssistido: categorySums, isLoading: false, totalSerie:totalSerie })
        } else {
          this.setState({ genresFavorite: [], isLoading: false })
        }
      })
  };
  render() {
    const { seriesWatched, navigation } = this.props;
    console.log('serires', seriesWatched)
    if (seriesWatched === null) {
      return <ActivityIndicator />;
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#263238' }}>
        {this.state.isLoading ? <Loader show={true} loading={this.state.isLoading} /> : null}
        <Header backgroundColor={'#D32F2F'}
          containerStyle={{ borderBottomWidth: 0 }}
          leftComponent={{ icon: 'menu', color: '#fff', size: 30, onPress: () => this.props.navigation.openDrawer() }}
          centerComponent={<Text style={{ color: 'white', fontWeight: 'bold' }}>ESTATÍSTICAS</Text>}
          rightComponent={null}
        />

        <View style={{ padding:10, borderRadius: 5, margin: 10, elevation: 2, backgroundColor: '#455A64'}}>
        <Text style={{fontFamily: 'Roboto', color: 'white', marginBottom: 5, fontSize: 12}}>TEMPO TOTAL ASSISTIDO</Text> 
        <View style={{borderBottomWidth: 1, borderColor: '#f5f5f5',opacity: 0.5}}/>
        <View style={{flexDirection: 'row', alignContent: 'center', justifyContent: 'center'}}>
        <View style={{justifyContent: 'flex-end'}}><Text style={{color: 'white', fontSize: 25, fontWeight: 'bold'}}>{this.state.dia}</Text></View>
          <View style={{justifyContent: 'flex-end'}}><Text  style={{color: 'white', fontSize: 15}}> dias </Text></View>
          <View style={{justifyContent: 'flex-end'}}><Text style={{color: 'white', fontSize: 25, fontWeight: 'bold'}}>{this.state.hora}</Text></View>
          <View style={{justifyContent: 'flex-end'}}><Text  style={{color: 'white', fontSize: 15}}> horas </Text></View>
          <View style={{justifyContent: 'flex-end'}}><Text style={{color: 'white', fontSize: 25, fontWeight: 'bold'}}>{this.state.minuto}</Text></View>
          <View style={{justifyContent: 'flex-end'}}><Text  style={{color: 'white', fontSize: 15}}> minutos </Text></View>
        </View >
        </View>  
        <View style={{margin: 10, elevation: 2, backgroundColor: '#455A64', padding: 20, borderRadius: 5}}>
        <Text style={{fontFamily: 'Roboto', color: 'white', marginBottom: 5, fontSize: 12}}>GÊNEROS FAVORITOS</Text> 
        <View style={{borderBottomWidth: 1, borderColor: '#f5f5f5', opacity: 0.5}}/>
        <PieChart 
          data={this.state.totalSerie}
          width={Dimensions.get("window").width} // from react-native
          height={220}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`}}

          accessor="total"
          backgroundColor="transparent"
          absolute
        />
        <Text style={{color: 'white', fontFamily: 'Roboto', textAlign: 'center'}}>{`Você assistiu ${seriesWatched.length} filmes até agora.`}</Text>
      </View>
      </View>
    );
  }
}


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
)(UserStats);
