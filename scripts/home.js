document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../index.html";
  });

  document.getElementById("myBookingsBtn").addEventListener("click", () => {
  window.location.href = "myBookings.html"; 
});


  loadNowShowing();
  loadUpcomingMovies();
});

function loadNowShowing() {
  axios
    .get(
      "http://localhost/cinemabooking/CinemaBooking-Server/Controllers/get_now_showing.php"
    )
    .then((res) => {
      const container = document.getElementById("now-showing");
      container.innerHTML = "";

      if (res.data.status === 200 && Array.isArray(res.data.now_showing)) {
        res.data.now_showing.forEach((movie) => {
          container.appendChild(createMovieCard(movie));
        });
      } else {
        console.warn("Unexpected response format:", res.data);
      }
    })
    .catch((err) => console.error("Error fetching now showing:", err));
}

function loadUpcomingMovies() {
  axios
    .get(
      "http://localhost/cinemabooking/CinemaBooking-Server/Controllers/get_upcoming.php"
    )
    .then((res) => {
      const container = document.getElementById("upcoming-movies");
      container.innerHTML = "";

      if (res.data.status === 200 && Array.isArray(res.data.upcoming)) {
        res.data.upcoming.forEach((movie) => {
          container.appendChild(createUpcomingMovieCard(movie));
        });
      } else {
        console.warn("Unexpected response format:", res.data);
      }
    })
    .catch((err) => console.error("Error fetching upcoming movies:", err));
}

function createMovieCard(movie) {
  const card = document.createElement("div");
  card.className = "movie-card";

  const img = document.createElement("img");
  const posterPath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : "https://via.placeholder.com/150x225?text=No+Image";

  img.src = posterPath;
  img.alt = movie.title;

  const title = document.createElement("p");
  title.setAttribute("class", "movie-title");
  title.textContent = movie.title;
  const release_date = document.createElement("p");
  release_date.setAttribute("class", "release-date");
  release_date.textContent = movie.release_date;

  card.appendChild(img);
  card.appendChild(title);
  card.appendChild(release_date);

  card.addEventListener("click", () => {
    localStorage.setItem("selectedMovie", JSON.stringify(movie));
    window.location.href = "booking.html";
  });
  return card;
}

function createUpcomingMovieCard(movie) {
  const card = document.createElement("div");
  card.className = "movie-card";

  const img = document.createElement("img");
  const posterPath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : "https://via.placeholder.com/150x225?text=No+Image";

  img.src = posterPath;
  img.alt = movie.title;

  const title = document.createElement("p");
  title.setAttribute("class", "movie-title");
  title.textContent = movie.title;
  const release_date = document.createElement("p");
  release_date.setAttribute("class", "release-date");
  release_date.textContent = movie.release_date;

  card.appendChild(img);
  card.appendChild(title);
  card.appendChild(release_date);

  return card;
}

