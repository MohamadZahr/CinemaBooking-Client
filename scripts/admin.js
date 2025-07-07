const BASE_URL = "http://localhost/CinemaBooking/CinemaBooking-Server";

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    window.location.href = "../index.html";
    return;
  }

  populateMovieDropdown();
  loadShowtimes();

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../index.html";
  });

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

function populateMovieDropdown() {
  axios
    .get(`${BASE_URL}/released_movies`)
    .then((response) => {
      const data = response.data;
      const movieSelect = document.getElementById("movie");
      movieSelect.innerHTML = '<option value="">-- Select Movie --</option>';

      if (data.status === 200 && Array.isArray(data.payload.movies)) {
        data.payload.movies.forEach((movie) => {
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

function loadShowtimes() {
  axios
    .get(`${BASE_URL}/showtimes`)
    .then((response) => {
      const tbody = document.getElementById("showtime-body");
      tbody.innerHTML = "";

      if (response.data.status === 200) {
        response.data.payload.showtimes.forEach((showtime) => {
          const row = document.createElement("tr");

          row.innerHTML = `
            <td>${showtime.movie_title}</td>
            <td>${showtime.auditorium_name}</td>
            <td>${showtime.time_slot}</td>
            <td>${showtime.start_date}</td>
            <td>${showtime.end_date}</td>
            <td><button class="delete-btn" data-id="${showtime.id}">Delete</button></td>
          `;

          tbody.appendChild(row);
        });

        document.querySelectorAll(".delete-btn").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const id = e.target.getAttribute("data-id");
            if (confirm("Are you sure you want to delete this showtime?")) {
              deleteShowtime(id);
            }
          });
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching showtimes:", error);
    });
}

function deleteShowtime(id) {
  axios
    .delete(`${BASE_URL}/delete_showtime`, {
      data: { id: parseInt(id) },
    })
    .then((res) => {
      if (res.data.status === 200) {
        alert("Showtime deleted successfully!");
        loadShowtimes();
      } else {
        alert("Failed to delete showtime.");
      }
    })
    .catch((err) => {
      console.error("Delete failed:", err);
      alert("Server error while deleting.");
    });
}

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
    .post(`${BASE_URL}/create_showtime`, payload)
    .then((response) => {
      if (response.data.status === 200) {
        alert("Showtime created successfully!");
        document.getElementById("showtime-form").reset();
        document.getElementById("showtime-modal").style.display = "none";
        loadShowtimes(); // 🔁 Refresh table
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
