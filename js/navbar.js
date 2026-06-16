const navbar = document.getElementById("navbar");

if (navbar) {
  navbar.innerHTML = `
    <nav>
      <h2>John Kerlagon</h2>

      <div class="nav-links">
        <a href="/index.html">Home</a>

        <div class="dropdown">
          <a href="/languages/index.html">Languages ▾</a>

          <div class="dropdown-menu">
            <a href="/languages/mandarin.html">Mandarin</a>
            <a href="/languages/japanese.html">Japanese</a>
            <a href="/languages/taiwanese.html">Taiwanese</a>
            <a href="/languages/korean.html">Korean</a>
            <a href="/languages/french.html">French</a>
            <a href="/languages/german.html">German</a>
          </div>
        </div>

        <div class="dropdown">
          <a href="/projects/index.html">Projects ▾</a>

          <div class="dropdown-menu">
            <a href="/projects/2026-goals.html">2026 Goals</a>
            <a href="/projects/conlangs.html">Conlangs</a>
          </div>
        </div>

        <a href="/contact.html">Contact</a>
<a href="/settings.html">Settings</a>
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
