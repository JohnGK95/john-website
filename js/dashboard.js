const dashboardDate = document.getElementById("dashboard-date");
const dashboardTime = document.getElementById("dashboard-time");
const nextEventWidget = document.getElementById("next-event-widget");
const goalSummaryWidget = document.getElementById("goal-summary-widget");
const dailyWordsWidget = document.getElementById("daily-words-widget");
const recentNotesWidget = document.getElementById("recent-notes-widget");

const dashboardLanguages = [
  "mandarin",
  "japanese",
  "taiwanese",
  "korean",
  "french",
  "german",
];

function getStoredArray(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

function renderNextEvent() {
  if (!nextEventWidget) return;

  const today = getTodayString();

  const events = getStoredArray("events")
    .filter((event) => (event.endDate || event.startDate) >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  if (events.length === 0) {
    nextEventWidget.innerHTML = `<p>No upcoming events.</p>`;
    return;
  }

  const event = events[0];

  nextEventWidget.innerHTML = `
    <h3>${event.title}</h3>
    <p>${event.startDate}${event.endDate && event.endDate !== event.startDate ? ` → ${event.endDate}` : ""}</p>
    ${event.notes ? `<p>${event.notes}</p>` : ""}
  `;
}

function calculateGoalProgress(goal) {
  if (!goal.milestones || goal.milestones.length === 0) return 0;

  const completed = goal.milestones.filter((m) => m.completed).length;
  return Math.round((completed / goal.milestones.length) * 100);
}

function renderGoalSummary() {
  if (!goalSummaryWidget) return;

  const goals = getStoredArray("goals");

  if (goals.length === 0) {
    goalSummaryWidget.innerHTML = `<p>No goals yet.</p>`;
    return;
  }

  const average =
    goals.reduce((total, goal) => total + calculateGoalProgress(goal), 0) /
    goals.length;

  goalSummaryWidget.innerHTML = `
    <h3>${goals.length} active goal${goals.length === 1 ? "" : "s"}</h3>
    <p>Average progress: ${Math.round(average)}%</p>

    <div class="progress-row">
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${Math.round(average)}%"></div>
      </div>
    </div>
  `;
}

function getWordId(word) {
  return `${word.word}-${word.pronunciation}-${word.meaning}`;
}

function getDailyWord(words, learnedWords) {
  const unlearnedWords = words.filter(
    (word) => !learnedWords.includes(getWordId(word)),
  );

  if (unlearnedWords.length === 0) return null;

  const today = getTodayString();
  const dayNumber = Number(today.split("-").join(""));

  return unlearnedWords[dayNumber % unlearnedWords.length];
}

function renderDailyWords() {
  if (!dailyWordsWidget) return;

  const wordItems = dashboardLanguages
    .map((language) => {
      const vocabulary = getStoredArray(`vocabulary-${language}`);
      const learned = getStoredArray(`learned-vocabulary-${language}`);
      const word = getDailyWord(vocabulary, learned);

      if (!word) return null;

      return `
        <div class="dashboard-word">
          <strong>${language}</strong>
          <span>${word.word}</span>
          <small>${word.meaning || ""}</small>
        </div>
      `;
    })
    .filter(Boolean)
    .join("");

  dailyWordsWidget.innerHTML =
    wordItems || `<p>No vocabulary uploaded yet.</p>`;
}

function renderRecentNotes() {
  if (!recentNotesWidget) return;

  const allNotes = dashboardLanguages.flatMap((language) =>
    getStoredArray(`notes-${language}`).map((note) => ({
      ...note,
      language,
    })),
  );

  const recentNotes = allNotes
    .filter((note) => note.updatedAt)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 3);

  if (recentNotes.length === 0) {
    recentNotesWidget.innerHTML = `<p>No recent notes.</p>`;
    return;
  }

  recentNotesWidget.innerHTML = recentNotes
    .map(
      (note) => `
        <div class="recent-note">
          <strong>${note.title}</strong>
          <span>${note.language}</span>
        </div>
      `,
    )
    .join("");
}
function renderDashboardDate() {
  if (!dashboardDate) return;

  const now = new Date();

  dashboardDate.textContent = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (dashboardTime) {
    dashboardTime.textContent = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
}
renderNextEvent();
renderGoalSummary();
renderDailyWords();
renderRecentNotes();
renderDashboardDate();
