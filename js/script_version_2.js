// Fetching and showing depending on endpoints

import { API, IMAGE, TOKEN } from './env.js'; 


const endpoints = {
    now_playing: '/now_playing',
    popular: '/popular',
    top_rated: '/top_rated',
    upcoming: '/upcoming',
};

// ===== DOM =====
const navigation = document.querySelector('nav');
const movieList = document.querySelector("#movieList");
const movieTemplate = document.querySelector("#movieCardTemplate");

// ===== Events (menu-delegation) =====
navigation.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    e.preventDefault();

    // aktivt link
    navigation.querySelectorAll('a').forEach(a => a.classList.remove('selected'));
    link.classList.add('selected');
    
    // title
    document.title = `${link.textContent.trim()} | The Movie Database`;

    // get data
    getMovies(link.dataset.type);
});

// ===== Fetch =====
async function getMovies(type='now_playing') {
    try {
        const url = `${API}${endpoints[type]}?language=en-US&page=1`;

        // send the request with headers
        const res = await fetch(url, {
            headers: {
                accept: "application/json",
                Authorization: TOKEN,
            },
        });
        
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();
        
        movieCards(data.results);
    } catch (err) {
        console.error(err);
    }
}

// ===== Render (manuel DOM-build) =====
function movieCards(movies) {
    movieList.innerHTML = "";
    const fragmentMovies = document.createDocumentFragment();

    movies.forEach((movie) => {
        const movieCard = movieTemplate.content.cloneNode(true); // modern and less heavy way to clone
        
        movieCard.querySelector('.movie_title').textContent = movie.title ?? ''; // if the title is null, then leave it empty
        movieCard.querySelector('.description').textContent = movie.overview ?? ''; // if the overview is null, then leave it empty
        
        movieCard.querySelector('.original_title').textContent = movie.original_title;
        movieCard.querySelector('.release_date').textContent = movie.release_date;
        
        const poster = movieCard.querySelector('img');
        poster.src = movie.poster_path ? `${IMAGE}${movie.poster_path}` : '';
        poster.alt = movie.title ?? '';
        poster.loading = 'lazy';

        fragmentMovies.appendChild(movieCard);
    });

    movieList.appendChild(fragmentMovies);
}

// initial
getMovies("now_playing");
