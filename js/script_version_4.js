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

        movieCard.innerHTML = `
            <header>
                <h2 class="movie_title">${movie.title ?? ''}</h2>
            </header>
            <section class="image_text">
                <div class="poster_wrapper">
                <img
                    src="${movie.poster_path ? `${IMAGE}${movie.poster_path}` : ''}"
                    alt="${movie.title ?? ''}"
                    loading="lazy">
                </div>
                <div>
                <p class="description">${movie.overview ?? ''}</p>
                <p><strong>Original title:</strong> <span class="original_title">${movie.original_title ?? ''}</span></p>
                <p><strong>Release date:</strong> <span class="release_date">${movie.release_date ?? ''}</span></p>
                </div>
            </section>
        `;

        fragmentMovies.appendChild(movieCard);
    });

    movieList.appendChild(fragmentMovies);
}

// initial
getMovies("now_playing");
