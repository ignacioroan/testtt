import template from './Searcher.html';
import './Searcher.scss';

const _parseData = function(data) {
  return {
    title: data.Title !== 'N/A' ? data.Title : 'Title not available',
    year: data.Year !== 'N/A' ? data.Year : '????',
    plot: data.Plot !== 'N/A' ? data.Plot : 'Plot not available',
    rating: data.imdbRating !== 'N/A' ? data.imdbRating : 'Not rated',
    imdbID: data.imdbID !== 'N/A' ? data.imdbID : 'https://www.imdb.com/',
    poster: data.Poster !== 'N/A' ? data.Poster : 'https://dummyimage.com/300x412/ccc/666.png&text=Not+available',
  };
};
const omdbApi = {
  URL: 'http://www.omdbapi.com',
  // API_KEY: 'ca1f0f1',
  API_KEY: '422350ff',
  type: 'movie',
};

const _getMovieData = (url) => fetch(url).then((response) => response.json());
const _toggleLoadingStatus = function() {
  document.getElementsByTagName('body')[0].classList.toggle('is-loading');
}

export class Searcher {

  init(list) {

    const searcherDOM = document.getElementById('wrapper_MovieSearcher');
    searcherDOM.innerHTML = template;

    document.getElementById('MovieSearcher').onsubmit = async function(event) {

      event.preventDefault();

      const searchString = document.getElementById('MovieSearcher_formControl').value;
      const listUrl = `${omdbApi.URL}/?apikey=${omdbApi.API_KEY}&s=${searchString}&type=${omdbApi.type}`;

      // set App as loading while fetching data
      _toggleLoadingStatus();

      try {

        const rawData = await _getMovieData(listUrl);

        // proceed if we fetch the raw AND there is at least a movie
        if (rawData.Response === 'True') {
          const promises = rawData.Search.map(function(element) {
            const movieUrl = `${omdbApi.URL}/?apikey=${omdbApi.API_KEY}&i=${element.imdbID}`;
            return _getMovieData(movieUrl).then(data => _parseData(data));
          });

          Promise.all(promises).then((results) => {
            _toggleLoadingStatus(); // remove loading status
            list.updateGrid(results);
          })
        } else {
          _toggleLoadingStatus(); // remove loading status
          // TOIMPROVE: display a message 'that is not a movie'
          console.error(rawData.Error);
        }

      } catch(error) {
        _toggleLoadingStatus(); // remove loading status
        console.error(error);
      }

    };

  }

}