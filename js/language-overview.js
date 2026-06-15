const vocabCount = document.getElementById("vocab-count");
const dailyWordPreview = document.getElementById("daily-word-preview");

const languageVocabularyKey = `vocabulary-${vocabLanguage}`;
const learnedVocabularyKey = `learned-vocabulary-${vocabLanguage}`;

const savedVocabulary =
  JSON.parse(localStorage.getItem(languageVocabularyKey)) || [];
let learnedWords = JSON.parse(localStorage.getItem(learnedVocabularyKey)) || [];

function saveLearnedWords() {
  localStorage.setItem(learnedVocabularyKey, JSON.stringify(learnedWords));
}

function getWordId(word) {
  return `${word.word}-${word.pronunciation}-${word.meaning}`;
}

function getDailyWord(words) {
  const unlearnedWords = words.filter(
    (word) => !learnedWords.includes(getWordId(word)),
  );

  if (unlearnedWords.length === 0) return null;

  const today = new Date().toISOString().split("T")[0];
  const dayNumber = today.split("-").join("");
  const index = Number(dayNumber) % unlearnedWords.length;

  return unlearnedWords[index];
}

if (vocabCount) {
  const remainingCount = savedVocabulary.filter(
    (word) => !learnedWords.includes(getWordId(word)),
  ).length;

  vocabCount.textContent = `${savedVocabulary.length} words saved · ${remainingCount} still in rotation`;
}

if (dailyWordPreview) {
  const dailyWord = getDailyWord(savedVocabulary);

  if (dailyWord) {
    dailyWordPreview.innerHTML = `
      <h3>Today's Word</h3>

      <div class="daily-word-card">
        <h4>${dailyWord.word}</h4>

        <p><strong>Pronunciation:</strong> ${dailyWord.pronunciation || ""}</p>
        <p><strong>Meaning:</strong> ${dailyWord.meaning || ""}</p>
        <p><strong>Example:</strong> ${dailyWord.example || ""}</p>
        <p><strong>Translation:</strong> ${dailyWord.translation || ""}</p>

        <label class="learned-word-check">
          <input id="learned-word-checkbox" type="checkbox" />
          I learned this word
        </label>
      </div>
    `;

    const checkbox = document.getElementById("learned-word-checkbox");

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        learnedWords.push(getWordId(dailyWord));
        saveLearnedWords();
        location.reload();
      }
    });
  } else {
    dailyWordPreview.innerHTML = `
      <p>You've learned all uploaded vocabulary for this language. 🎉</p>
    `;
  }
}
