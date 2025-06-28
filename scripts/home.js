document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    // Optional: redirect if not logged in
    window.location.href = "index.html";
    return;
  }

  // Set username in navbar
  const usernameSpan = document.getElementById("username");
  usernameSpan.textContent = user.full_name;
});
