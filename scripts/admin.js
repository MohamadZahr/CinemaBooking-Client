document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    window.location.href = "../index.html";
    return;
  }

  populateMovieDropdown();

  document.getElementById("add-showtime-btn").addEventListener("click", () => {
    document.getElementById("showtime-modal").style.display = "flex";
  });

  document.getElementById("cancel-btn").addEventListener("click", () => {
    document.getElementById("showtime-modal").style.display = "none";
  });

  document
    .getElementById("showtime-form")
    .addEventListener("submit", handleFormSubmit);
});

// ✅ Fetch latest movies for dropdown
function populateMovieDropdown() {
  axios
    .get(
      "http://localhost/cinemabooking/CinemaBooking-Server/Controllers/get_latest_movies.php"
    )
    .then((response) => {
      const data = response.data;
      const movieSelect = document.getElementById("movie");
      movieSelect.innerHTML = '<option value="">-- Select Movie --</option>';

      if (data.status === 200 && Array.isArray(data.movies)) {
        data.movies.forEach((movie) => {
          const option = document.createElement("option");
          option.value = movie.id;
          option.textContent = movie.title;
          movieSelect.appendChild(option);
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching movies:", error);
    });
}

// ✅ Handle create showtime form submission
function handleFormSubmit(e) {
  e.preventDefault();

  const payload = {
    movie_id: document.getElementById("movie").value,
    auditorium_id: document.getElementById("auditorium").value,
    time_slot: document.getElementById("time-slot").value,
    start_date: document.getElementById("start-date").value,
    end_date: document.getElementById("end-date").value,
  };

  axios
    .post(
      "http://localhost/cinemabooking/CinemaBooking-Server/Controllers/create_showtime.php",
      payload
    )
    .then((response) => {
      if (response.data.status === 200) {
        alert("Showtime created successfully!");
        document.getElementById("showtime-form").reset();
        document.getElementById("showtime-modal").style.display = "none";
        // TODO: Optionally refresh showtimes table here
      } else {
        alert("Error: " + response.data.error);
      }
    })
    .catch((error) => {
      if (error.response && error.response.status === 409) {
        alert("That time slot is already booked in this auditorium.");
      } else {
        console.error("Error creating showtime:", error);
        alert("Server error.");
      }
    });
}
