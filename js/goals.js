const showGoalFormButton = document.getElementById("show-goal-form");
const goalFormPanel = document.getElementById("goal-form-panel");
const goalForm = document.getElementById("goal-form");
const goalTitle = document.getElementById("goal-title");
const goalDescription = document.getElementById("goal-description");
const goalList = document.getElementById("goal-list");

let goals = JSON.parse(localStorage.getItem("goals")) || [];
let expandedGoalIndex = null;
let editingCardIndex = null;

function saveGoals() {
  localStorage.setItem("goals", JSON.stringify(goals));
}

function calculateProgress(goal) {
  if (!goal.milestones || goal.milestones.length === 0) return 0;

  const completed = goal.milestones.filter((m) => m.completed).length;
  return Math.round((completed / goal.milestones.length) * 100);
}

function renderGoals() {
  if (!goalList) return;

  goalList.innerHTML = "";

  goals.forEach((goal, goalIndex) => {
    const progress = calculateProgress(goal);
    const isExpanded = expandedGoalIndex === goalIndex;
    const isEditing = editingCardIndex === goalIndex;

    const goalCard = document.createElement("div");
    goalCard.className = "goal-card";

    goalCard.innerHTML = `
      <div class="goal-summary">
        <div class="goal-summary-main">
          <h2>${goal.title}</h2>

          <div class="progress-row compact">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress}%"></div>
            </div>

            <span>${progress}%</span>
          </div>
        </div>

        <button type="button" class="toggle-details" data-goal-index="${goalIndex}">
          ${isExpanded ? "Hide Details" : "More Details"}
        </button>
      </div>

      ${
        isExpanded
          ? `
            <div class="goal-details">
              ${
                isEditing
                  ? `
                    <div class="goal-edit-area">
                      <input class="edit-goal-title" value="${goal.title}" />
                      <textarea class="edit-goal-description">${goal.description || ""}</textarea>

                      <div class="goal-actions">
                        <button type="button" class="save-goal-edit" data-goal-index="${goalIndex}">
                          Save Changes
                        </button>

                        <button type="button" class="cancel-goal-edit">
                          Cancel
                        </button>
                      </div>
                    </div>
                  `
                  : `
                    <div class="goal-description-area">
                      <h3>Description</h3>
                      <p>${goal.description || "No description yet."}</p>

                      <div class="goal-actions">
                        <button
  type="button"
  class="edit-goal icon-button"
  data-goal-index="${goalIndex}"
  title="Edit Goal"
>
  ✏️
</button>

                        <button
  type="button"
  class="delete-goal icon-button"
  data-goal-index="${goalIndex}"
  title="Delete Goal"
>
  🗑️
</button>
                      </div>
                    </div>
                  `
              }

              <div class="milestone-section">
                <h3>Milestones</h3>

                <form class="milestone-form" data-goal-index="${goalIndex}">
                  <input type="text" placeholder="Add milestone..." required />
                  <button type="submit">Add Milestone</button>
                </form>

                <div class="milestone-list">
                  ${(goal.milestones || [])
                    .map(
                      (milestone, milestoneIndex) => `
                        <div class="milestone-item">
                          <label>
                            <input
                              type="checkbox"
                              class="milestone-checkbox"
                              data-goal-index="${goalIndex}"
                              data-milestone-index="${milestoneIndex}"
                              ${milestone.completed ? "checked" : ""}
                            />
                            <span>${milestone.text}</span>
                          </label>

                          <div class="milestone-actions">
                            <button
  type="button"
  class="edit-milestone icon-button"
  data-goal-index="${goalIndex}"
  data-milestone-index="${milestoneIndex}"
  title="Edit Milestone"
>
  ✏️
</button>

                            <button
  type="button"
  class="delete-milestone icon-button"
  data-goal-index="${goalIndex}"
  data-milestone-index="${milestoneIndex}"
  title="Delete Milestone"
>
  🗑️
</button>
                          </div>
                        </div>
                      `,
                    )
                    .join("")}
                </div>
              </div>
            </div>
          `
          : ""
      }
    `;

    goalList.appendChild(goalCard);
  });
}

if (showGoalFormButton) {
  showGoalFormButton.addEventListener("click", () => {
    goalFormPanel.classList.toggle("hidden");
  });
}

if (goalForm) {
  goalForm.addEventListener("submit", (event) => {
    event.preventDefault();

    goals.push({
      title: goalTitle.value,
      description: goalDescription.value,
      milestones: [],
    });

    saveGoals();

    goalTitle.value = "";
    goalDescription.value = "";
    goalFormPanel.classList.add("hidden");

    renderGoals();
  });
}

if (goalList) {
  goalList.addEventListener("click", (event) => {
    const goalIndex = Number(event.target.dataset.goalIndex);
    const milestoneIndex = Number(event.target.dataset.milestoneIndex);

    if (event.target.classList.contains("toggle-details")) {
      expandedGoalIndex = expandedGoalIndex === goalIndex ? null : goalIndex;
      editingCardIndex = null;
      renderGoals();
      return;
    }

    if (event.target.classList.contains("edit-goal")) {
      editingCardIndex = goalIndex;
      renderGoals();
      return;
    }

    if (event.target.classList.contains("cancel-goal-edit")) {
      editingCardIndex = null;
      renderGoals();
      return;
    }

    if (event.target.classList.contains("save-goal-edit")) {
      const card = event.target.closest(".goal-card");
      const newTitle = card.querySelector(".edit-goal-title").value;
      const newDescription = card.querySelector(".edit-goal-description").value;

      goals[goalIndex].title = newTitle;
      goals[goalIndex].description = newDescription;

      editingCardIndex = null;

      saveGoals();
      renderGoals();
      return;
    }

    if (event.target.classList.contains("delete-goal")) {
      goals.splice(goalIndex, 1);
      expandedGoalIndex = null;
      editingCardIndex = null;
      saveGoals();
      renderGoals();
      return;
    }

    if (event.target.classList.contains("edit-milestone")) {
      const currentText = goals[goalIndex].milestones[milestoneIndex].text;
      const newText = prompt("Edit milestone:", currentText);

      if (newText !== null && newText.trim() !== "") {
        goals[goalIndex].milestones[milestoneIndex].text = newText.trim();
        saveGoals();
        renderGoals();
      }

      return;
    }

    if (event.target.classList.contains("delete-milestone")) {
      goals[goalIndex].milestones.splice(milestoneIndex, 1);
      saveGoals();
      renderGoals();
      return;
    }
  });

  goalList.addEventListener("submit", (event) => {
    if (!event.target.classList.contains("milestone-form")) return;

    event.preventDefault();

    const goalIndex = Number(event.target.dataset.goalIndex);
    const input = event.target.querySelector("input");

    goals[goalIndex].milestones.push({
      text: input.value,
      completed: false,
    });

    saveGoals();
    renderGoals();
  });

  goalList.addEventListener("change", (event) => {
    if (!event.target.classList.contains("milestone-checkbox")) return;

    const goalIndex = Number(event.target.dataset.goalIndex);
    const milestoneIndex = Number(event.target.dataset.milestoneIndex);

    goals[goalIndex].milestones[milestoneIndex].completed =
      event.target.checked;

    saveGoals();
    renderGoals();
  });
}

renderGoals();
