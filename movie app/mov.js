const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="';

// Get references to DOM elements
const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const homeBtn = document.getElementById('home-btn');

// Fetch initial popular movies
getMovies(API_URL);

// Function to get movies from API
async function getMovies(url) {
    const res = await fetch(url);
    const data = await res.json();
    displayMovies(data.results);
}

// Function to display movies on the page
function displayMovies(movies) {
    main.innerHTML = ''; // Clear previous movies

    movies.forEach(async movie => {
        const { title, poster_path, vote_average, overview, genre_ids } = movie;
        const genres = await getGenres(genre_ids);

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        movieEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="rating ${getClassByRate(vote_average)}">${vote_average}</span>
                <p>Genres: ${genres.join(', ')}</p>
                <p>${overview.length > 100 ? overview.slice(0, 100) + '...' : overview}</p>
            </div>
        `;
        main.appendChild(movieEl);
    });
}

// Function to get genre names from genre IDs
async function getGenres(genre_ids) {
    const genreRes = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=3fd2be6f0c70a2a598f084ddfb75487c`);
    const genreData = await genreRes.json();
    const genreMap = genreData.genres.reduce((map, genre) => {
        map[genre.id] = genre.name;
        return map;
    }, {});
    
    return genre_ids.map(id => genreMap[id]);
}

// Function to get rating color
function getClassByRate(vote) {
    if (vote >= 8) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

// Event listener for form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const searchTerm = search.value;

    if (searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm);
        search.value = '';
    } else {
        window.location.reload();
    }
});

homeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    getMovies(API_URL); // Fetch and display popular movies when Home is clicked
});
