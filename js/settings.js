const exportButton = document.getElementById("export-backup");
const importInput = document.getElementById("import-backup");
const backupStatus = document.getElementById("backup-status");

const backupKeys = [
  "events",
  "goals",
  "theme",

  "vocabulary-mandarin",
  "vocabulary-japanese",
  "vocabulary-taiwanese",
  "vocabulary-korean",
  "vocabulary-french",
  "vocabulary-german",

  "learned-vocabulary-mandarin",
  "learned-vocabulary-japanese",
  "learned-vocabulary-taiwanese",
  "learned-vocabulary-korean",
  "learned-vocabulary-french",
  "learned-vocabulary-german",

  "notes-mandarin",
  "notes-japanese",
  "notes-taiwanese",
  "notes-korean",
  "notes-french",
  "notes-german",
];

function showBackupStatus(message) {
  if (backupStatus) {
    backupStatus.textContent = message;
  }
}

function exportBackup() {
  const backup = {
    app: "john-website",
    exportedAt: new Date().toISOString(),
    data: {},
  };

  backupKeys.forEach((key) => {
    const value = localStorage.getItem(key);

    if (value !== null) {
      backup.data[key] = value;
    }
  });

  const file = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });

  const downloadLink = document.createElement("a");

  downloadLink.href = URL.createObjectURL(file);
  downloadLink.download = `john-website-backup-${
    new Date().toISOString().split("T")[0]
  }.json`;

  downloadLink.click();

  URL.revokeObjectURL(downloadLink.href);

  showBackupStatus("Backup exported successfully.");
}

function importBackup(file) {
  const reader = new FileReader();

  reader.onload = () => {
    try {
      const backup = JSON.parse(reader.result);

      if (!backup.data) {
        showBackupStatus("This backup file is not valid.");
        return;
      }

      Object.entries(backup.data).forEach(([key, value]) => {
        if (backupKeys.includes(key)) {
          localStorage.setItem(key, value);
        }
      });

      showBackupStatus(
        "Backup imported successfully. Refresh the page to see restored data.",
      );
    } catch (error) {
      showBackupStatus("Could not import this backup file.");
    }
  };

  reader.readAsText(file);
}

if (exportButton) {
  exportButton.addEventListener("click", exportBackup);
}

if (importInput) {
  importInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (!file) return;

    importBackup(file);
  });
}
