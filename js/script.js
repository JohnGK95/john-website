console.log("My website is running!");
const eventForm = document.getElementById("event-form");
const eventDate = document.getElementById("event-date");
const eventTitle = document.getElementById("event-title");
const eventNotes = document.getElementById("event-notes");
const eventList = document.getElementById("event-list");

let events = JSON.parse(localStorage.getItem("events")) || [];

function todayString() {
  return new Date().toISOString().split("T")[0];
}

function cleanOldEvents() {
  const today = todayString();
  events = events.filter((event) => event.date >= today);
  saveEvents();
}

function saveEvents() {
  localStorage.setItem("events", JSON.stringify(events));
}

function sortEvents() {
  events.sort((a, b) => a.date.localeCompare(b.date));
}

function renderEvents() {
  if (!eventList) return;

  cleanOldEvents();
  sortEvents();

  eventList.innerHTML = "";

  events.forEach((event, index) => {
    const li = document.createElement("li");
    li.className = "event-item";

    li.innerHTML = `
  <div class="event-info">

    <strong>${event.date}</strong>

    <span class="event-title">
      ${event.title}
    </span>

    ${event.notes ? `<p class="event-notes">${event.notes}</p>` : ""}

  </div>

  <button data-index="${index}" class="delete-event">
    Delete
  </button>
`;

    eventList.appendChild(li);
  });
}

if (eventForm) {
  eventForm.addEventListener("submit", (e) => {
    e.preventDefault();

    events.push({
      date: eventDate.value,
      title: eventTitle.value,
      notes: eventNotes.value,
    });

    saveEvents();
    renderEvents();
    eventForm.reset();
  });
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-event")) {
    const index = e.target.dataset.index;
    events.splice(index, 1);
    saveEvents();
    renderEvents();
  }
});

renderEvents();
