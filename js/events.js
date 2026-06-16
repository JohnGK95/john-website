const eventForm = document.getElementById("event-form");
const eventStartDate = document.getElementById("event-start-date");
const eventEndDate = document.getElementById("event-end-date");
const eventTitle = document.getElementById("event-title");
const eventNotes = document.getElementById("event-notes");
const eventList = document.getElementById("event-list");
const showEventForm = document.getElementById("show-event-form");

const eventCreateCard = document.querySelector(".event-create-card");
let events = JSON.parse(localStorage.getItem("events")) || [];

const currentCalendarDate = new Date();

function saveEvents() {
  localStorage.setItem("events", JSON.stringify(events));
}

function todayString() {
  return new Date().toISOString().split("T")[0];
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

  if (today >= startDate && today <= endDate) {
    if (today === endDate) return "Ends today";
    return "Happening now";
  }

  const oneDay = 1000 * 60 * 60 * 24;
  const daysUntilStart = Math.ceil(
    (new Date(startDate) - new Date(today)) / oneDay,
  );

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

  renderCalendar();
}

function getEventsForDate(date) {
  return events.filter(
    (event) => date >= event.startDate && date <= event.endDate,
  );
}

function renderCalendar() {
  const calendarGrid = document.getElementById("calendar-grid");
  const monthTitle = document.getElementById("calendar-month");

  if (!calendarGrid || !monthTitle) return;

  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();

  monthTitle.textContent = currentCalendarDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  calendarGrid.innerHTML = "";

  const days = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= days; day++) {
    const div = document.createElement("div");
    div.className = "calendar-day";
    div.textContent = day;

    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day,
    ).padStart(2, "0")}`;

    const eventsForDate = getEventsForDate(date);

    if (eventsForDate.length > 0) {
      div.classList.add("has-event");

      const tooltip = document.createElement("span");
      tooltip.className = "calendar-tooltip";
      tooltip.textContent = eventsForDate
        .map((event) => event.title)
        .join(", ");

      div.appendChild(tooltip);
    }

    calendarGrid.appendChild(div);
  }
}

document.addEventListener("click", (e) => {
  if (e.target.id === "prev-month") {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    renderCalendar();
  }

  if (e.target.id === "next-month") {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    renderCalendar();
  }

  if (e.target.classList.contains("delete-event")) {
    const index = e.target.dataset.index;
    events.splice(index, 1);
    saveEvents();
    renderEvents();
  }
});

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
if (showEventForm) {
  showEventForm.addEventListener("click", () => {
    eventCreateCard.classList.toggle("hidden");

    showEventForm.textContent = eventCreateCard.classList.contains("hidden")
      ? "+ Add Event"
      : "Close";
  });
}
renderEvents();
