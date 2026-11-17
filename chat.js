const STORAGE_KEY = 'sharedGitHubEntries';

// Shared variable holding all text entries
let savedEntries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Save a new entry to the variable and browser storage
function addEntry(text) {
  const cleanText = text.trim();
  if (cleanText === '') return;

  savedEntries.push(cleanText);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedEntries));
  renderRows();
}

// Display all saved entries in rows
function renderRows() {
  const rowsContainer = document.getElementById('rowsContainer');
  if (!rowsContainer) return;

  rowsContainer.innerHTML = '';

  savedEntries.forEach((entry) => {
    const row = document.createElement('div');
    row.className = 'row';
    row.textContent = entry;
    rowsContainer.appendChild(row);
  });
}

// Automatically connect the input box and load existing rows on page load
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('textInput');

  if (input) {
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        addEntry(input.value);
        input.value = '';
      }
    });
  }

  renderRows();
});
