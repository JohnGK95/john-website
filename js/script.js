console.log("My website is running!");
const eventForm = document.getElementById("event-form");
const eventStartDate = document.getElementById("event-start-date");
const eventEndDate = document.getElementById("event-end-date");
const eventTitle = document.getElementById("event-title");
const eventNotes = document.getElementById("event-notes");
const eventList = document.getElementById("event-list");

let events = JSON.parse(localStorage.getItem("events")) || [];

function todayString() {
  return new Date().toISOString().split("T")[0];
}

function saveEvents() {
  localStorage.setItem("events", JSON.stringify(events));
}

function cleanOldEvents() {
  const today = todayString();

  events = events.filter((event) => {
    const endDate = event.endDate || event.startDate;
    return endDate >= today;
  });

  saveEvents();
}

function getCountdownText(event) {
  const today = todayString();
  const startDate = event.startDate;
  const endDate = event.endDate || event.startDate;

  const todayTime = new Date(today).getTime();
  const startTime = new Date(startDate).getTime();
  const endTime = new Date(endDate).getTime();

  const oneDay = 1000 * 60 * 60 * 24;

  if (today >= startDate && today <= endDate) {
    if (today === endDate) return "Ends today";
    return "Happening now";
  }

  const daysUntilStart = Math.ceil((startTime - todayTime) / oneDay);

  if (daysUntilStart === 1) return "Starts tomorrow";
  return `Starts in ${daysUntilStart} days`;
}

function formatDateRange(event) {
  if (!event.endDate || event.endDate === event.startDate) {
    return event.startDate;
  }

  return `${event.startDate} → ${event.endDate}`;
}

function sortEvents() {
  events.sort((a, b) => a.startDate.localeCompare(b.startDate));
}

function renderEvents() {
  if (!eventList) return;

  cleanOldEvents();
  sortEvents();

  eventList.innerHTML = "";

  events.forEach((event, index) => {
    const li = document.createElement("li");
    li.className = "event-card";

    li.innerHTML = `
      <div class="event-card-main">
        <div>
          <h3>${event.title}</h3>
          <p class="event-date">${formatDateRange(event)}</p>
          ${event.notes ? `<p class="event-notes">${event.notes}</p>` : ""}
        </div>

        <div class="event-side">
          <span class="event-countdown">${getCountdownText(event)}</span>
          <button data-index="${index}" class="delete-event">Delete</button>
        </div>
      </div>
    `;

    eventList.appendChild(li);
  });
}

if (eventForm) {
  eventForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const startDate = eventStartDate.value;
    const endDate = eventEndDate.value || startDate;

    if (endDate < startDate) {
      alert("End date cannot be before start date.");
      return;
    }

    events.push({
      startDate,
      endDate,
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
