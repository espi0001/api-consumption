// Fetching only now_playing 

async function moviesData() {
    const URL = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1'
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NTUyMzY5N2I4OWYyNjVmMTk4OGIyM2E5MDg0MzEwOSIsIm5iZiI6MTc1OTc0OTkzMi40ODg5OTk4LCJzdWIiOiI2OGUzYTcyYzAzMDZkMzYzMzBjMjJhMGUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.RdSvNJUTAxgkfwvIAH2b_SMRDTU83MYhSCc6PKbRHBA'
        }
    }
    try {
        const response = await fetch(URL, options);
        if (!response.ok) {
            throw new Error(`Fetch status: ${response.status}`)
        }
        const data = await response.json();
        console.log(data);
        movieCards(data.results); // sends the array 
    } catch (error){
        console.error(error.message);
    }
}
function movieCards(movies) {
    const movieTemplate = document.querySelector("#movieCardTemplate");
    const movieList = document.querySelector("#movieList");

    movieList.innerHTML = '';

    const fragmentMovies = document.createDocumentFragment();

    movies.forEach((movie) => {
        const movieCard = movieTemplate.content.cloneNode(true);

        movieCard.querySelector('.movie_title').textContent = movie.title;
        console.log(movie.title);
        
        movieCard.querySelector('.description').textContent = movie.overview;
        console.log(movie.overview);

        movieCard.querySelector('.original_title').textContent = movie.original_title;
        console.log(movie.original_title);
        
        movieCard.querySelector('.release_date').textContent = movie.release_date;
        console.log(movie.release_date);
        
        movieCard.querySelector("img").src = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "";
        
        fragmentMovies.appendChild(movieCard);
    });

    movieList.appendChild(fragmentMovies);
}

moviesData();
