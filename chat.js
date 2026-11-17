// Edit this list on GitHub anytime you want to update the text on everyone's page
const messages = [
  "Welcome! Here is the latest update.",
  "Second line of text from GitHub.",
  "Edit chat.js on GitHub to change these rows."
];

function renderRows() {
  const rowsContainer = document.getElementById('rowsContainer');
  if (!rowsContainer) return;

  rowsContainer.innerHTML = '';

  messages.forEach((entry) => {
    const row = document.createElement('div');
    row.className = 'row';
    row.textContent = entry;
    rowsContainer.appendChild(row);
  });
}

// Run immediately if the DOM is already loaded, or wait for it
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderRows);
} else {
  renderRows();
}
