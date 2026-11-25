const ADMIN_PASSWORD = "admin123";
const STORAGE_KEY = 'games';

const CATEGORIES = ['Rummy', 'Teen Patti', 'Ludo', 'Slots', 'Spin', 'Poker'];
let games = [];

// Keep first-run examples consistent with the public catalog.
const DEMO_GAMES = [
  { id: 'demo-rummy-01', name: 'Royal Rummy', category: 'Rummy', bonus: '₹1,000 welcome bonus', size: '48 MB', version: '2.4.1', downloads: 12500, shortDescription: 'Play exciting rummy tables, join tournaments, and sharpen your card skills.', description: 'Join Royal Rummy for friendly tables, daily challenges, and exciting tournaments. Practice your strategy, play with friends, and enjoy a polished rummy experience wherever you go.', downloadLink: 'https://example.com/', status: 'Active', featured: true, logo: '', banner: '' },
  { id: 'demo-patti-02', name: 'Teen Patti Royale', category: 'Teen Patti', bonus: '₹500 starter chips', size: '62 MB', version: '1.8.0', downloads: 9800, shortDescription: 'A lively Teen Patti experience with quick matches and classic tables.', description: 'Teen Patti Royale brings the familiar card-table experience to your phone. Choose a table, invite friends, and enjoy quick rounds with a clean interface and daily rewards.', downloadLink: 'https://example.com/', status: 'Active', featured: true, logo: '', banner: '' },
  { id: 'demo-ludo-03', name: 'Ludo Legends', category: 'Ludo', bonus: 'Daily login rewards', size: '35 MB', version: '3.2.0', downloads: 18700, shortDescription: 'Roll the dice, race your tokens, and challenge friends in Ludo.', description: 'Ludo Legends is made for friendly competition. Play classic matches, invite your friends, and unlock new boards as you race your tokens around the board.', downloadLink: 'https://example.com/', status: 'Active', featured: true, logo: '', banner: '' },
  { id: 'demo-slots-04', name: 'Neon Slots', category: 'Slots', bonus: '100 free spins', size: '54 MB', version: '1.5.3', downloads: 6400, shortDescription: 'Bright arcade-inspired reels, colorful themes, and daily missions.', description: 'Step into a neon arcade with a collection of colorful slot-style games, daily missions, and a lively soundtrack. Explore new themes and keep track of your personal milestones.', downloadLink: 'https://example.com/', status: 'Active', featured: false, logo: '', banner: '' },
  { id: 'demo-spin-05', name: 'Spin & Win', category: 'Spin', bonus: 'Welcome reward included', size: '41 MB', version: '1.2.6', downloads: 5200, shortDescription: 'Spin through playful prize wheels and collect daily rewards.', description: 'Spin & Win offers quick, casual prize-wheel rounds and a new daily challenge. Collect rewards, explore themed wheels, and enjoy bite-sized play sessions.', downloadLink: 'https://example.com/', status: 'Active', featured: false, logo: '', banner: '' },
  { id: 'demo-poker-06', name: 'Ace Poker Club', category: 'Poker', bonus: 'New player chip pack', size: '70 MB', version: '4.0.2', downloads: 11300, shortDescription: 'Join a friendly poker club and take on tables at your own pace.', description: 'Ace Poker Club gives you a welcoming place to enjoy poker-inspired play. Pick a table, learn at your own pace, and take part in regular club events.', downloadLink: 'https://example.com/', status: 'Active', featured: false, logo: '', banner: '' }
];

function loadGames() {
  const savedGames = localStorage.getItem(STORAGE_KEY);
  if (savedGames === null) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_GAMES));
    return [...DEMO_GAMES];
  }
  const parsedGames = JSON.parse(savedGames);
  if (!Array.isArray(parsedGames)) throw new Error('Saved game data must be a list.');
  return parsedGames;
}

function saveGames() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
}

function safeHttpUrl(value) {
  if (!value) return '';
  try {
    const url = new URL(value, window.location.href);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

function createLogo(game) {
  const logo = document.createElement('div');
  logo.className = 'game-logo';
  const url = safeHttpUrl(game.logo);
  if (url) {
    const image = document.createElement('img');
    image.src = url;
    image.alt = '';
    image.onerror = () => { image.remove(); logo.textContent = (game.name || '?').slice(0, 1).toUpperCase(); };
    logo.append(image);
  } else {
    logo.textContent = (game.name || '?').slice(0, 1).toUpperCase();
  }
  return logo;
}

function renderGameList() {
  const list = document.getElementById('admin-game-list');
  list.replaceChildren();
  document.getElementById('admin-game-count').textContent = `${games.length} ${games.length === 1 ? 'game' : 'games'}`;
  document.getElementById('admin-empty').hidden = games.length > 0;

  for (const game of games) {
    const row = document.createElement('div');
    row.className = 'admin-game-row';
    row.append(createLogo(game));
    const info = document.createElement('div');
    info.className = 'admin-game-info';
    const name = document.createElement('strong');
    name.textContent = game.name || 'Untitled game';
    const details = document.createElement('span');
    details.textContent = `${game.category || 'Other'} · ${game.featured ? 'Featured' : 'Standard'}`;
    info.append(name, details);
    const status = document.createElement('span');
    status.className = `status-badge${game.status === 'Active' ? '' : ' inactive'}`;
    status.textContent = game.status || 'Inactive';
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('aria-label', `Delete ${game.name || 'game'}`);
    deleteButton.addEventListener('click', () => deleteGame(game.id));
    row.append(info, status, deleteButton);
    list.append(row);
  }
}

function deleteGame(id) {
  const game = games.find(item => String(item.id) === String(id));
  if (!game || !window.confirm(`Delete "${game.name}"? This cannot be undone.`)) return;
  games = games.filter(item => String(item.id) !== String(id));
  try {
    saveGames();
    renderGameList();
  } catch (error) {
    showFormMessage(`Unable to save changes: ${error.message}`, true);
    games.push(game);
    renderGameList();
  }
}

function showFormMessage(message, isError = false) {
  const element = document.getElementById('form-message');
  element.textContent = message;
  element.classList.toggle('error', isError);
  element.hidden = false;
}

function handleAddGame(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const values = new FormData(form);
  const name = String(values.get('name') || '').trim();
  const downloadLink = String(values.get('downloadLink') || '').trim();
  if (!name || !downloadLink) {
    showFormMessage('Game Name and Official Download Link are required.', true);
    return;
  }
  if (!safeHttpUrl(downloadLink)) {
    showFormMessage('Please enter a valid official download URL starting with http:// or https://.', true);
    return;
  }
  const logo = String(values.get('logo') || '').trim();
  const banner = String(values.get('banner') || '').trim();
  if ((logo && !safeHttpUrl(logo)) || (banner && !safeHttpUrl(banner))) {
    showFormMessage('Logo and banner image URLs must start with http:// or https://.', true);
    return;
  }
  const category = String(values.get('category') || '');
  if (!CATEGORIES.includes(category)) {
    showFormMessage('Choose a valid game category.', true);
    return;
  }

  let id = Date.now();
  const usedIds = new Set(games.map(game => String(game.id)));
  while (usedIds.has(String(id))) id += 1;
  const game = {
    id: String(id),
    name,
    logo,
    banner,
    category,
    bonus: String(values.get('bonus') || '').trim(),
    size: String(values.get('size') || '').trim(),
    version: String(values.get('version') || '').trim(),
    downloads: Math.max(0, Number.parseInt(String(values.get('downloads') || '0'), 10) || 0),
    shortDescription: String(values.get('shortDescription') || '').trim(),
    description: String(values.get('description') || '').trim(),
    downloadLink: safeHttpUrl(downloadLink),
    status: values.get('status') === 'Inactive' ? 'Inactive' : 'Active',
    featured: values.get('featured') === 'on'
  };

  games.unshift(game);
  try {
    saveGames();
    form.reset();
    renderGameList();
    showFormMessage('Game added successfully.');
  } catch (error) {
    games = games.filter(item => String(item.id) !== String(game.id));
    showFormMessage(`Unable to save the game: ${error.message}`, true);
  }
}

function startPage() {
  document.getElementById('current-year').textContent = new Date().getFullYear();
  document.getElementById('login-form').addEventListener('submit', event => {
    event.preventDefault();
    const enteredPassword = document.getElementById('admin-password').value;
    if (enteredPassword !== ADMIN_PASSWORD) {
      document.getElementById('login-error').hidden = false;
      return;
    }
    document.getElementById('login-error').hidden = true;
    document.getElementById('login-panel').hidden = true;
    document.getElementById('admin-panel').hidden = false;
    try {
      games = loadGames();
      renderGameList();
    } catch (error) {
      const message = document.getElementById('admin-storage-error');
      message.textContent = `Unable to load games: ${error.message}`;
      message.hidden = false;
    }
  });
  document.getElementById('game-form').addEventListener('submit', handleAddGame);
  document.getElementById('logout-button').addEventListener('click', () => {
    document.getElementById('admin-panel').hidden = true;
    document.getElementById('login-panel').hidden = false;
    document.getElementById('admin-password').value = '';
  });
}

document.addEventListener('DOMContentLoaded', startPage);
