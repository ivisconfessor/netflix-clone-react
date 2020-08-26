import React, { useEffect, useState } from 'react';

import Tmdb from './Tmdb'
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie'; 
import Header from './components/Header';

import './App.css';

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      // Pegando a lista TOTAL
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      // Pegando o Featured
      let originals = list.filter(i => i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);
    }
    
    loadAll();
  }, []);

  useEffect(() => {
    const scroolListener = () => {
      if(window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    }

    window.addEventListener('scroll', scroolListener);
    return () => {
      window.removeEventListener('scroll', scroolListener);
    }
  }, []);

  return (
    <div className="page">

      <Header black={blackHeader} />

      {featuredData && 
        <FeaturedMovie item={featuredData} />
      }

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
        Feito com <span role="img" aria-label="coração">❤️</span> por <a href="https://github.com/ivisconfessor" target="_black">Ivís Confessor</a> 
        <br/>com a orientação do <a href="https://github.com/bonieky" target="_black">Bonieky Larceda</a>{'\n'}   
        durante a Live <span role="img" aria-label="fogo">🔥</span> Clone do NETFLIX em REACTJS para Iniciantes 
        <strong> em 24/08/2020</strong><br/><br/>
        Direitos de imagem para Netflix<br/>
        Dados pegos do site Themoviedb.org
      </footer>
      
      {movieList.length <= 0 &&
        <div className="loading">
            <img src="https://www.filmelier.com/pt/br/news/wp-content/uploads/2020/03/netflix-loading.gif" alt="Carregando" />
        </div>
      }
    </div>
  );
}