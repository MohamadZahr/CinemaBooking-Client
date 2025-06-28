document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    window.location.href = "../index.html";
    return;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  loadNowShowing();
  loadComingSoon();

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../index.html";
  });
});

function loadNowShowing() {
  axios.get("../api/get_now_showing.php")
    .then(res => {
      const container = document.getElementById("now-showing");
      container.innerHTML = "";

      if (res.data.status === 200) {
        res.data.now_showing.forEach(movie => {
          container.appendChild(createMovieCard(movie));
        });
      }
    })
    .catch(err => console.error("Error fetching now showing:", err));
}

function loadComingSoon() {
  axios.get("../api/get_latest_movies.php")
    .then(res => {
      const container = document.getElementById("coming-soon");
      container.innerHTML = "";

      if (res.data.status === 200) {
        const futureMovies = res.data.movies.filter(m => {
          const release = new Date(m.release_date);
          const today = new Date();
          return release > today;
        });

        futureMovies.forEach(movie => {
          container.appendChild(createMovieCard(movie));
        });
      }
    })
    .catch(err => console.error("Error fetching coming soon:", err));
}

function createMovieCard(movie) {
  const card = document.createElement("div");
  card.className = "movie-card";

  const img = document.createElement("img");
  img.src = movie.poster_path || "https://via.placeholder.com/150x225?text=No+Image";
  img.alt = movie.title;

  const title = document.createElement("p");
  title.textContent = movie.title;

  card.appendChild(img);
  card.appendChild(title);
  return card;
}
