const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const messageDiv = document.getElementById("message");

const showSignupBtn = document.getElementById("show-signup");
const showLoginBtn = document.getElementById("show-login");

showSignupBtn.addEventListener("click", () => {
  signupForm.style.display = "block";
  loginForm.style.display = "none";
  showSignupBtn.classList.add("active");
  showLoginBtn.classList.remove("active");
  messageDiv.textContent = "";
});

showLoginBtn.addEventListener("click", () => {
  signupForm.style.display = "none";
  loginForm.style.display = "block";
  showLoginBtn.classList.add("active");
  showSignupBtn.classList.remove("active");
  messageDiv.textContent = "";
});

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("full-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  messageDiv.textContent = "Signing up...";

  try {
    const response = await axios.post("http://localhost/cinemabooking/CinemaBooking-Server/Controllers/create_user.php", {
      full_name: fullName,
      email: email,
      password: password
    });

    if (response.data.status === 201) {
      messageDiv.style.color = "green";
      messageDiv.textContent = "Signup successful!";
    } else {
      messageDiv.style.color = "red";
      messageDiv.textContent = "Signup failed: " + response.data.message;
    }
  } catch (error) {
    console.error(error);
    messageDiv.style.color = "red";
    messageDiv.textContent = "Error during signup.";
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  messageDiv.textContent = "Logging in...";

  try {
    const response = await axios.post("http://localhost/cinemabooking/CinemaBooking-Server/Controllers/login.php", {
      email: email,
      password: password
    });

    if (response.data.status === 200) {
      messageDiv.style.color = "green";
      messageDiv.textContent = "Login successful!";
      localStorage.setItem("user", JSON.stringify(response.data.user));
      console.log("Logged in user:", response.data.user);

      if(response.data.user.role === "admin") {
        window.location.href = "../pages/adminHome.html"; 
      } else {
        window.location.href = "../pages/home.html"; 
      }
    } else {
      messageDiv.style.color = "red";
      messageDiv.textContent = "Login failed: " + response.data.message;
    }
  } catch (error) {
    console.error(error);
    messageDiv.style.color = "red";
    messageDiv.textContent = "Error during login.";
  }
});
