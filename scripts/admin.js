document.addEventListener("DOMContentLoaded", () => {
  populateMovieDropdown();
});

document.getElementById("add-showtime-btn").addEventListener("click", () => {
  document.getElementById("showtime-modal").style.display = "flex";
});

document.getElementById("cancel-btn").addEventListener("click", () => {
  document.getElementById("showtime-modal").style.display = "none";
});

document.getElementById("showtime-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const movie = document.getElementById("movie").value;
  const auditorium = document.getElementById("auditorium").value;
  const timeSlot = document.getElementById("time-slot").value;
  const startDate = document.getElementById("start-date").value;
  const endDate = document.getElementById("end-date").value;

  // TODO: Send this data to the backend API when it's ready

  console.log("New Showtime:", {
    movie,
    auditorium,
    timeSlot,
    startDate,
    endDate,
  });

  // Close modal
  document.getElementById("showtime-modal").style.display = "none";

  // Optionally reset form
  e.target.reset();
});

function populateMovieDropdown() {
  axios.get("http://localhost/cinemabooking/CinemaBooking-Server/Controllers/get_latest_movies.php")
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
      } else {
        console.error("Unexpected response format:", data);
      }
    })
    .catch((error) => {
      console.error("Error fetching movies:", error);
    });
}

document.getElementById("showtime-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    movie_id: document.getElementById("movie").value,
    auditorium_id: document.getElementById("auditorium").value,
    time_slot: document.getElementById("time-slot").value,
    start_date: document.getElementById("start-date").value,
    end_date: document.getElementById("end-date").value,
  };

  try {
    const response = await axios.post("http://localhost/cinemabooking/CinemaBooking-Server/Controllers/create_showtime.php", payload);
    if (response.data.status === 200) {
      alert("Showtime created successfully!");
      document.getElementById("showtime-form").reset();
      document.getElementById("showtime-modal").style.display = "none";
    } else {
      alert("Failed to create showtime: " + response.data.error);
    }
  } catch (err) {
    console.error("Error creating showtime:", err);
    alert("Server error");
  }
});
