const vocabUpload = document.getElementById("vocab-upload");
const vocabList = document.getElementById("vocab-list");

const vocabStorageKey = `vocabulary-${vocabLanguage}`;

let vocabulary = JSON.parse(localStorage.getItem(vocabStorageKey)) || [];

function saveVocabulary() {
  localStorage.setItem(vocabStorageKey, JSON.stringify(vocabulary));
}

function renderVocabulary() {
  if (!vocabList) return;

  vocabList.innerHTML = "";

  vocabulary.forEach((entry) => {
    const card = document.createElement("div");
    card.className = "vocab-card";

    card.innerHTML = `
      <h3>${entry.word}</h3>
      <p><strong>Pronunciation:</strong> ${entry.pronunciation}</p>
      <p><strong>Meaning:</strong> ${entry.meaning}</p>
      <p><strong>Example:</strong> ${entry.example}</p>
      <p><strong>Translation:</strong> ${entry.translation}</p>
      <p><strong>Notes:</strong> ${entry.notes}</p>
    `;

    vocabList.appendChild(card);
  });
}

function parseCSV(text) {
  const rows = text.trim().split("\n");
  const headers = rows[0].split(",").map((header) => header.trim());

  return rows.slice(1).map((row) => {
    const values = row.split(",").map((value) => value.trim());
    const entry = {};

    headers.forEach((header, index) => {
      entry[header] = values[index] || "";
    });

    return entry;
  });
}

if (vocabUpload) {
  vocabUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      vocabulary = parseCSV(reader.result);
      saveVocabulary();
      renderVocabulary();
    };

    reader.readAsText(file);
  });
}

renderVocabulary();
