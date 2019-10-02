const BASE_URL = "https://api.themoviedb.org/3/";
module.exports = {
   CONFIG: {
    apiKey: "AIzaSyANrg7BYCCXpkT9zo6Mb3CG_BuBc1AfdkU",
    authDomain: "seriesjera2019.firebaseapp.com",
    databaseURL: "https://seriesjera2019.firebaseio.com",
    projectId: "seriesjera2019",
    storageBucket: "",
    messagingSenderId: "750035580453",
    appId: "1:750035580453:web:19ab5f51ba30efef92b1cc"
  },
  URL: {
    BASE_URL: "https://api.themoviedb.org/3/",
    IMAGE_URL: "http://image.tmdb.org/t/p/w185",
    API_KEY: "api_key=b83e15027df50325aa48d0cdc5c9bf30&language=pt-BR",
    SEARCH_QUERY: "search/movie?query=",
    PLACEHOLDER_IMAGE: "https://s3-ap-southeast-1.amazonaws.com/popcornsg/placeholder-movieimage.png",
    POPULAR_FILMS: "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=b83e15027df50325aa48d0cdc5c9bf30&language=pt-BR",
    RECOMEND_FIMLS: "https://api.themoviedb.org/3/discover/movie?api_key=b83e15027df50325aa48d0cdc5c9bf30&language=pt-BR&with_genres="
  },
  Strings: {
    MAIN_TITLE: "Series",
    SECONDARY_TITLE: "Detalhes do filme",
    PLACEHOLDER: "Qual filme/serie está procurando?",
    SEARCH_BUTTON: "Pesquisar",
    RELEASE_DATE: "Data de lançamento: ",
    LANGUAGE: "Idioma: ",
    POPULARITY: "Popularidade: ",
    STATUS: "Status: ",
    RATINGS: "Nota: ",
    BUDGET: "Despesas: ",
    REVENUE: "Receita: ",
    RUNTIME: "Tempo de duração: ",
    OVERVIEW: "Sinopse: ",
    MSG: "Este campo é obrigatório.",
    TOWHATCH: "Assistido:",
    GENRES: [{"id":28,"name":"Ação"},{"id":12,"name":"Aventura"},{"id":16,"name":"Animação"},{"id":35,"name":"Comédia"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentário"},{"id":18,"name":"Drama"},{"id":10751,"name":"Família"},{"id":14,"name":"Fantasia"},{"id":36,"name":"História"},{"id":27,"name":"Terror"},{"id":10402,"name":"Música"},{"id":9648,"name":"Mistério"},{"id":10749,"name":"Romance"},{"id":878,"name":"Ficção científica"},{"id":10770,"name":"Cinema TV"},{"id":53,"name":"Thriller"},{"id":10752,"name":"Guerra"},{"id":37,"name":"Faroeste"}]
  },
  Colors: {
    Cyan: "#02ADAD",
    Grey: "#EDEDED",
    Transparent: "transparent"
  }
};