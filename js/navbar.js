const navbar = document.getElementById("navbar");

if (navbar) {
  navbar.innerHTML = `
    <nav>
      <h2>John Kerlagon</h2>

      <div class="nav-links">
        <a href="/index.html">Home</a>
        <a href="/languages/index.html">Languages</a>
        <a href="/projects/index.html">Projects</a>
        <a href="/contact.html">Contact</a>
        <button id="theme-toggle" type="button">🌙</button>
      </div>
    </nav>
  `;

  const themeToggle = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
      themeToggle.textContent = "☀️";
    } else {
      localStorage.setItem("theme", "light");
      themeToggle.textContent = "🌙";
    }
  });
}
