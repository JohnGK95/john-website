const noteForm = document.getElementById("note-form");
const noteTitle = document.getElementById("note-title");
const noteContent = document.getElementById("note-content");
const noteTag = document.getElementById("note-tag");
const noteList = document.getElementById("note-list");
const noteTagFilter = document.getElementById("note-tag-filter");

let activeTagFilter = "all";
const notesStorageKey = `notes-${vocabLanguage}`;

let notes = JSON.parse(localStorage.getItem(notesStorageKey)) || [];
let editingNoteIndex = null;

function saveNotes() {
  localStorage.setItem(notesStorageKey, JSON.stringify(notes));
}

function nowTimestamp() {
  return Date.now();
}

function sortNotes() {
  notes.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;

    return (b.updatedAt || 0) - (a.updatedAt || 0);
  });
}

function renderNotes() {
  if (!noteList) return;

  sortNotes();
  function getUniqueTags() {
    return [...new Set(notes.map((note) => note.tag).filter((tag) => tag))];
  }

  function renderTagFilters() {
    if (!noteTagFilter) return;

    const tags = getUniqueTags();

    noteTagFilter.innerHTML = `<option value="all">
      All Tags
    </option>`;

    tags.forEach((tag) => {
      const option = document.createElement("option");

      option.value = tag;

      option.textContent = tag;

      if (tag === activeTagFilter) {
        option.selected = true;
      }

      noteTagFilter.appendChild(option);
    });
  }
  saveNotes();
  renderTagFilters();

  noteList.innerHTML = "";

  const visibleNotes =
    activeTagFilter === "all"
      ? notes
      : notes.filter((note) => note.tag === activeTagFilter);

  visibleNotes.forEach((note) => {
    const index = notes.indexOf(note);
    const isEditing = editingNoteIndex === index;
    const noteCard = document.createElement("div");
    noteCard.className = `note-card ${note.pinned ? "pinned-note" : ""}`;

    noteCard.innerHTML = isEditing
      ? `
        <div class="note-edit-area">
          <input class="edit-note-title" value="${note.title}" />

          <textarea class="edit-note-content">${note.content}</textarea>

          <input class="edit-note-tag" value="${note.tag || ""}" />

          <div class="note-actions">
            <button type="button" class="save-note-edit" data-index="${index}">
              Save
            </button>

            <button type="button" class="cancel-note-edit">
              Cancel
            </button>
          </div>
        </div>
      `
      : `
        <div>
          <div class="note-title-row">
            <h3>${note.title}</h3>
            ${note.pinned ? `<span class="pinned-label">Pinned</span>` : ""}
          </div>

          <p>${note.content}</p>

          ${note.tag ? `<span class="note-tag">${note.tag}</span>` : ""}

          <p class="note-updated">
            Last edited: ${
              note.updatedAt
                ? new Date(note.updatedAt).toLocaleString()
                : "Unknown"
            }
          </p>
        </div>

        <div class="note-actions">
          <button type="button" class="pin-note icon-button" data-index="${index}" title="Pin Note">
            ${note.pinned ? "📍" : "📌"}
          </button>

          <button type="button" class="edit-note icon-button" data-index="${index}" title="Edit Note">
            ✏️
          </button>

          <button type="button" class="delete-note icon-button" data-index="${index}" title="Delete Note">
            🗑️
          </button>
        </div>
      `;

    noteList.appendChild(noteCard);
  });
}

if (noteForm) {
  noteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    notes.push({
      title: noteTitle.value,
      content: noteContent.value,
      tag: noteTag.value,
      pinned: false,
      createdAt: nowTimestamp(),
      updatedAt: nowTimestamp(),
    });

    saveNotes();
    renderNotes();
    noteForm.reset();
  });
}

if (noteList) {
  noteList.addEventListener("click", (event) => {
    const index = Number(event.target.dataset.index);

    if (event.target.classList.contains("pin-note")) {
      notes[index].pinned = !notes[index].pinned;
      notes[index].updatedAt = nowTimestamp();
      saveNotes();
      renderNotes();
      return;
    }

    if (event.target.classList.contains("edit-note")) {
      editingNoteIndex = index;
      renderNotes();
      return;
    }

    if (event.target.classList.contains("cancel-note-edit")) {
      editingNoteIndex = null;
      renderNotes();
      return;
    }

    if (event.target.classList.contains("save-note-edit")) {
      const card = event.target.closest(".note-card");

      notes[index].title = card.querySelector(".edit-note-title").value;
      notes[index].content = card.querySelector(".edit-note-content").value;
      notes[index].tag = card.querySelector(".edit-note-tag").value;
      notes[index].updatedAt = nowTimestamp();

      editingNoteIndex = null;

      saveNotes();
      renderNotes();
      return;
    }

    if (event.target.classList.contains("delete-note")) {
      notes.splice(index, 1);
      saveNotes();
      renderNotes();
    }
  });
}
if (noteTagFilter) {
  noteTagFilter.addEventListener("change", () => {
    activeTagFilter = noteTagFilter.value;

    renderNotes();
  });
}
renderNotes();
