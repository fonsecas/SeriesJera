const BASE_URL = "https://api.themoviedb.org/3/";
module.exports = {
  URL: {
    BASE_URL: "https://api.themoviedb.org/3/",
    BASE_URL_MOVIE: "https://api.themoviedb.org/3/movie/",
    IMAGE_URL: "http://image.tmdb.org/t/p/w185",
    IMAGE_SINGLE_URL: "http://image.tmdb.org/t/p/w500",
    IMAGE_BANNER_URL: "https://api.themoviedb.org/3/movie/",
    API_KEY: "api_key=8f72024179b31532014de08efcc769c2",
    SEARCH_QUERY: "search/movie?query=", 
    SEARCH_BY_GENRES: 'https://api.themoviedb.org/3/discover/movie?api_key=8f72024179b31532014de08efcc769c2&language=pt-BR&sort_by=popularity.desc&include_adult=false&include_video=false&with_genres=',
    PLACEHOLDER_IMAGE: "https://s3-ap-southeast-1.amazonaws.com/popcornsg/placeholder-movieimage.png", 
    TOP_FILMS: "https://api.themoviedb.org/3/movie/top_rated?&api_key=8f72024179b31532014de08efcc769c2&language=pt-BR",
    POPULAR_FILMS: "https://api.themoviedb.org/3/movie/popular?&api_key=8f72024179b31532014de08efcc769c2&language=pt-BR",
    RECOMEND_FIMLS: "https://api.themoviedb.org/3/discover/movie?api_key=8f72024179b31532014de08efcc769c2&language=pt-BR&with_genres=",
    LANCAMENTO_FIMLS: "https://api.themoviedb.org/3/movie/now_playing?api_key=8f72024179b31532014de08efcc769c2&language=pt-BR"
 
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