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
  loadAuditoriumsAndShowtimes(movie.id);

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../index.html";
  });
  
  document.getElementById("homeBtn").addEventListener("click", () => {
    window.location.href = "home.html";
  });

  document.getElementById("auditorium").addEventListener("change", (e) => {
    const selectedAuditorium = parseInt(e.target.value);
    populateTimeSlots(selectedAuditorium);
  });

  document.getElementById("booking-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const seatId = e.target.dataset.selectedSeatId;
    
    if (!seatId) {
      alert("Please select a seat.");
      return;
    }

    submitBooking(seatId);
  });
});

let showtimes = [];
let selectedSeat = null;

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

function loadAuditoriumsAndShowtimes(movieId) {
  axios
    .get(`http://localhost/cinemabooking/CinemaBooking-Server/Controllers/get_showtimes.php?id=${movieId}`)
    .then((res) => {
      if (res.data.status === 200 && Array.isArray(res.data.showtimes)) {
        showtimes = res.data.showtimes;

        const uniqueAuditoriums = new Map();
        showtimes.forEach((s) => {
          if (!uniqueAuditoriums.has(s.auditorium_id)) {
            uniqueAuditoriums.set(s.auditorium_id, s.auditorium_name);
          }
        });

        const auditoriumSelect = document.getElementById("auditorium");
        auditoriumSelect.innerHTML = '<option value="">-- Select Auditorium --</option>';
        uniqueAuditoriums.forEach((name, id) => {
          const opt = document.createElement("option");
          opt.value = id;
          opt.textContent = name;
          auditoriumSelect.appendChild(opt);
        });
      }
    })
    .catch((err) => console.error("Error loading showtimes:", err));
}

function populateTimeSlots(auditoriumId) {
  const timeSlotSelect = document.getElementById("time-slot");
  timeSlotSelect.innerHTML = '<option value="">-- Select Time Slot --</option>';

  const filteredSlots = showtimes.filter((s) => s.auditorium_id === parseInt(auditoriumId));
  const added = new Set();

  filteredSlots.forEach((s) => {
    if (!added.has(s.time_slot)) {
      const opt = document.createElement("option");
      opt.value = s.time_slot;
      opt.textContent = s.time_slot;
      timeSlotSelect.appendChild(opt);
      added.add(s.time_slot);
    }
  });
}

const dateInput = document.getElementById("date");
const auditoriumSelect = document.getElementById("auditorium");
const timeSlotSelect = document.getElementById("time-slot");

[dateInput, auditoriumSelect, timeSlotSelect].forEach((el) =>
  el.addEventListener("change", checkFetchSeats)
);

function checkFetchSeats() {
  const date = dateInput.value;
  const auditoriumId = auditoriumSelect.value;
  const timeSlot = timeSlotSelect.value;

  if (date && auditoriumId && timeSlot) {
    fetchAvailableSeats(date, auditoriumId, timeSlot);
  }
}

function fetchAvailableSeats(date, auditoriumId, timeSlot) {
  axios
    .get("http://localhost/cinemabooking/CinemaBooking-Server/Controllers/get_available_seats.php", {
      params: { booking_date: date, auditorium_id: auditoriumId, time_slot: timeSlot }
    })
    .then((res) => {
      if (res.data.status === 200) {
        renderSeatGrid(res.data.available_seats);
      }
    })
    .catch((err) => {
      console.error("Error fetching available seats:", err);
    });
}

function renderSeatGrid(seats) {
  const grid = document.getElementById("seat-grid");
  grid.innerHTML = "";

  const seatMap = new Map();
  seats.forEach(seat => {
    const key = `${seat.row_label}${seat.seat_number}`;
    seatMap.set(key, seat);
  });

  const rows = "ABCDEFGHIJ";
  for (let r = 0; r < 10; r++) {
    for (let c = 1; c <= 10; c++) {
      const key = `${rows[r]}${c}`;
      const seat = seatMap.get(key);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = key;
      btn.className = "seat-button";
      btn.disabled = true;

      if (seat) {
        btn.dataset.seatId = seat.id;
        btn.dataset.seatType = seat.seat_type;

        const price = seat.seat_type === 'premium' ? 15.00 : 10.00;
        btn.dataset.price = price;
        
        btn.classList.add(seat.seat_type);
        btn.disabled = false;

        btn.addEventListener("click", () => {
          document.querySelectorAll(".seat-button.selected").forEach(b => b.classList.remove("selected"));
          btn.classList.add("selected");
          document.getElementById("booking-form").dataset.selectedSeatId = seat.id;
          selectedSeat = { ...seat, price: price };
          updatePriceDisplay(price);
        });
      }

      grid.appendChild(btn);
    }
  }
}

function updatePriceDisplay(price) {
  const priceDisplay = document.getElementById("price-display");
  if (priceDisplay) {
    priceDisplay.style.display = "block";
    priceDisplay.textContent = `Selected Seat Price: ${price}.00`;
  }
}

function submitBooking(seatId) {
  const user = JSON.parse(localStorage.getItem("user"));
  const dateInput = document.getElementById("date");
  const auditoriumSelect = document.getElementById("auditorium");
  const timeSlotSelect = document.getElementById("time-slot");
  
  if (!selectedSeat) {
    alert("Please select a seat.");
    return;
  }

  const bookingData = {
    user_id: user.id,
    auditorium_id: parseInt(auditoriumSelect.value),
    seat_id: parseInt(seatId),
    time_slot: timeSlotSelect.value,
    total_price: selectedSeat.price,
    booking_date: dateInput.value
  };

  console.log("Booking Data:", bookingData);
  axios
    .post("http://localhost/cinemabooking/CinemaBooking-Server/Controllers/create_booking.php", bookingData)
    .then((res) => {
      if (res.data.status === 201) {
        alert("Booking confirmed successfully!");
        window.location.href = "home.html";
      } else {
        alert("Booking failed: " + (res.data.error || "Unknown error"));
        console.error("Booking error:", res.data);
      }
    });
}