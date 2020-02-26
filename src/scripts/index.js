import { Searcher } from './Components/Searcher/Searcher';
import { MovieGrid } from './Components/MovieGrid/MovieGrid';
import '../stylesheets/style.scss';

function initComponents() {

  const movieGrid = new MovieGrid();
  const searcher = new Searcher();
  searcher.init(movieGrid);

}

initComponents();
