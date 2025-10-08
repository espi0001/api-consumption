// Fetching and showing depending on endpoints with DOM-build

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
        const movieCard = document.createElement('article');

        // header
        const header = document.createElement('header');
        const h2 = document.createElement('h2');
        h2.className = 'movie_title';
        h2.textContent = movie.title ?? ''; // If null, then empty
        header.appendChild(h2);

        // body grid
        const wrap = document.createElement('section');
        wrap.className = 'image_text';

        // poster
        const posterWrap = document.createElement('div');
        posterWrap.className = 'poster_wrapper';
        const moviePoster = document.createElement('img');
        moviePoster.loading = 'lazy';
        moviePoster.alt = movie.title ?? ''; // if null, then empty
        moviePoster.src = movie.poster_path ? `${IMAGE}${movie.poster_path}` : '';
        posterWrap.appendChild(moviePoster);

        // text info
        const movieinfo = document.createElement('div');

        const pDescription = document.createElement('p');
        pDescription.className = 'description';
        pDescription.textContent = movie.overview ?? ''; // if null, then empty

        const pOrignalTitle = document.createElement('p');
        pOrignalTitle.innerHTML = `<strong>Original title:</strong> <span class="original_title">${movie.original_title ?? ''}</span>`;

        const pReleaseDate = document.createElement('p');
        pReleaseDate.innerHTML = `<strong>Release date:</strong> <span class="release_date">${movie.release_date ?? ''}</span>`;

        movieinfo.append(pDescription, pOrignalTitle, pReleaseDate);
        wrap.append(posterWrap, movieinfo);

        // assemble card
        movieCard.append(header, wrap);
        fragmentMovies.appendChild(movieCard);
    });

    movieList.appendChild(fragmentMovies);
}

// initial
getMovies("now_playing");
