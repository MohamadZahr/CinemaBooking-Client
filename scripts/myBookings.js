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

  document.getElementById("homeBtn").addEventListener("click", () => {
    window.location.href = "home.html";
  });

});



