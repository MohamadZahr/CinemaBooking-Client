document.addEventListener("DOMContentLoaded", () => {
  const movie = JSON.parse(localStorage.getItem("selectedMovie"));
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  if (!movie) {
    alert("No movie selected.");
    window.location.href = "home.html";
    return;
  }

  displayMovieDetails(movie);

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../index.html";
  });

  document.getElementById("booking-form").addEventListener("submit", (e) => {
    e.preventDefault();

  });
});

function displayMovieDetails(movie) {
  const container = document.getElementById("movie-details");
  const posterPath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : "https://via.placeholder.com/150x225?text=No+Image";
  container.innerHTML = `
    <img src="${posterPath}" alt="${movie.title}" />
    <h2>${movie.title}</h2>
    <p><strong>Rating:</strong> ${movie.rating || 'N/A'}</p>
    <p><strong>Release Date:</strong> ${movie.release_date}</p>
    <p><strong>Popularity:</strong> ${movie.popularity}</p>
    <p>${movie.description}</p>
  `;
}
