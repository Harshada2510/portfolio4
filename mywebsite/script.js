document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section");

  // Show/hide sections
  function showSection(id) {
    sections.forEach((section) => section.classList.remove("active"));
    document.getElementById(id).classList.add("active");
  }

  // Theme toggle logic
  const toggle = document.getElementById("theme-toggle");
  const body = document.body;

  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark");
    toggle.checked = true;
  }

  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  });

  // Scroll-to-top button
  const scrollBtn = document.getElementById("scrollTopBtn");

  window.onscroll = function () {
    if (
      document.body.scrollTop > 200 ||
      document.documentElement.scrollTop > 200
    ) {
      scrollBtn.style.display = "block";
    } else {
      scrollBtn.style.display = "none";
    }
  };

  scrollBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Make showSection() globally available
  window.showSection = showSection;
});
