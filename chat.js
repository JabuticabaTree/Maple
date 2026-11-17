// START_MESSAGES
const messages = [
  "Welcome! Here is the latest update.",
  "Second line of text from GitHub."
];
// END_MESSAGES

const GITHUB_USER = 'theyellowsubmarine';
const GITHUB_REPO = 'Maple';
const FILE_PATH = 'chat.js';

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

async function pushMessageToGitHub(newText) {
  const tokenInput = document.getElementById('tokenInput');
  const statusEl = document.getElementById('status');
  const token = tokenInput ? tokenInput.value.trim() : '';

  if (!token) {
    alert('Please paste your GitHub Personal Access Token first.');
    return;
  }

  if (statusEl) statusEl.textContent = 'Saving to GitHub...';

  const apiUrl = `https://github.com{GITHUB_USER}/${GITHUB_REPO}/contents/${FILE_PATH}`;

  try {
    // 1. Fetch the current file metadata and SHA from GitHub
    const getRes = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!getRes.ok) throw new Error('Failed to fetch file. Check your token.');
    const fileData = await getRes.json();

    // 2. Decode the current file content from Base64 (supporting UTF-8)
    const currentContent = decodeURIComponent(escape(atob(fileData.content)));

    // 3. Add the new message to the array and rebuild the top block
    messages.push(newText);
    const updatedArrayBlock = `// START_MESSAGES\nconst messages = ${JSON.stringify(messages, null, 2)};\n// END_MESSAGES`;
    const newFileContent = currentContent.replace(
      /\/\/ START_MESSAGES[\s\S]*?\/\/ END_MESSAGES/,
      updatedArrayBlock
    );

    // 4. Encode back to Base64 and commit to GitHub
    const encodedContent = btoa(unescape(encodeURIComponent(newFileContent)));

    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Update messages via HTML page',
        content: encodedContent,
        sha: fileData.sha
      })
    });

    if (!putRes.ok) throw new Error('Failed to update file on GitHub.');

    renderRows();
    if (statusEl) statusEl.textContent = 'Saved! GitHub Pages will update for everyone in ~1 minute.';
  } catch (err) {
    console.error(err);
    if (statusEl) statusEl.textContent = `Error: ${err.message}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderRows();

  const textInput = document.getElementById('textInput');
  if (textInput) {
    textInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const cleanText = textInput.value.trim();
        if (cleanText !== '') {
          pushMessageToGitHub(cleanText);
          textInput.value = '';
        }
      }
    });
  }
});
