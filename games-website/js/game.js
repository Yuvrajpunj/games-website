const STORAGE_KEY = 'games';
const DEMO_GAMES = [
  {
    id: 'demo-rummy-01', name: 'Royal Rummy', category: 'Rummy', bonus: '₹1,000 welcome bonus',
    size: '48 MB', version: '2.4.1', downloads: 12500, shortDescription: 'Play exciting rummy tables, join tournaments, and sharpen your card skills.',
    description: 'Join Royal Rummy for friendly tables, daily challenges, and exciting tournaments. Practice your strategy, play with friends, and enjoy a polished rummy experience wherever you go.',
    downloadLink: 'https://example.com/', status: 'Active', featured: true, logo: '', banner: ''
  },
  {
    id: 'demo-patti-02', name: 'Teen Patti Royale', category: 'Teen Patti', bonus: '₹500 starter chips',
    size: '62 MB', version: '1.8.0', downloads: 9800, shortDescription: 'A lively Teen Patti experience with quick matches and classic tables.',
    description: 'Teen Patti Royale brings the familiar card-table experience to your phone. Choose a table, invite friends, and enjoy quick rounds with a clean interface and daily rewards.',
    downloadLink: 'https://example.com/', status: 'Active', featured: true, logo: '', banner: ''
  },
  {
    id: 'demo-ludo-03', name: 'Ludo Legends', category: 'Ludo', bonus: 'Daily login rewards',
    size: '35 MB', version: '3.2.0', downloads: 18700, shortDescription: 'Roll the dice, race your tokens, and challenge friends in Ludo.',
    description: 'Ludo Legends is made for friendly competition. Play classic matches, invite your friends, and unlock new boards as you race your tokens around the board.',
    downloadLink: 'https://example.com/', status: 'Active', featured: true, logo: '', banner: ''
  },
  {
    id: 'demo-slots-04', name: 'Neon Slots', category: 'Slots', bonus: '100 free spins',
    size: '54 MB', version: '1.5.3', downloads: 6400, shortDescription: 'Bright arcade-inspired reels, colorful themes, and daily missions.',
    description: 'Step into a neon arcade with a collection of colorful slot-style games, daily missions, and a lively soundtrack. Explore new themes and keep track of your personal milestones.',
    downloadLink: 'https://example.com/', status: 'Active', featured: false, logo: '', banner: ''
  },
  {
    id: 'demo-spin-05', name: 'Spin & Win', category: 'Spin', bonus: 'Welcome reward included',
    size: '41 MB', version: '1.2.6', downloads: 5200, shortDescription: 'Spin through playful prize wheels and collect daily rewards.',
    description: 'Spin & Win offers quick, casual prize-wheel rounds and a new daily challenge. Collect rewards, explore themed wheels, and enjoy bite-sized play sessions.',
    downloadLink: 'https://example.com/', status: 'Active', featured: false, logo: '', banner: ''
  },
  {
    id: 'demo-poker-06', name: 'Ace Poker Club', category: 'Poker', bonus: 'New player chip pack',
    size: '70 MB', version: '4.0.2', downloads: 11300, shortDescription: 'Join a friendly poker club and take on tables at your own pace.',
    description: 'Ace Poker Club gives you a welcoming place to enjoy poker-inspired play. Pick a table, learn at your own pace, and take part in regular club events.',
    downloadLink: 'https://example.com/', status: 'Active', featured: false, logo: '', banner: ''
  }
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

function safeHttpUrl(value) {
  if (!value) return '';
  try {
    const url = new URL(value, window.location.href);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

function addLogo(container, game) {
  const url = safeHttpUrl(game.logo);
  if (url) {
    const image = document.createElement('img');
    image.src = url;
    image.alt = `${game.name} logo`;
    image.onerror = () => { image.remove(); container.textContent = (game.name || '?').slice(0, 1).toUpperCase(); };
    container.append(image);
  } else {
    container.textContent = (game.name || '?').slice(0, 1).toUpperCase();
  }
}

function addStat(container, label, value) {
  const stat = document.createElement('div');
  stat.className = 'stat-item';
  const title = document.createElement('span');
  title.textContent = label;
  const detail = document.createElement('strong');
  detail.textContent = value || '—';
  stat.append(title, detail);
  container.append(stat);
}

function showGame(game) {
  document.title = `${game.name} — GameZone`;
  document.getElementById('detail-category').textContent = game.category || 'Other';
  document.getElementById('detail-name').textContent = game.name || 'Untitled game';
  document.getElementById('detail-description').textContent = game.description || game.shortDescription || 'No description available.';
  addLogo(document.getElementById('detail-logo-wrap'), game);

  const banner = document.getElementById('detail-banner');
  const bannerFallback = document.getElementById('detail-banner-fallback');
  const bannerUrl = safeHttpUrl(game.banner) || safeHttpUrl(game.logo);
  if (bannerUrl) {
    banner.src = bannerUrl;
    banner.alt = `${game.name} banner`;
    banner.onerror = () => {
      banner.hidden = true;
      bannerFallback.hidden = false;
      bannerFallback.textContent = '🎮';
    };
  } else {
    banner.hidden = true;
    bannerFallback.hidden = false;
    bannerFallback.textContent = '🎮';
  }

  const stats = document.getElementById('detail-stats');
  addStat(stats, 'Welcome bonus', game.bonus || '—');
  addStat(stats, 'App size', game.size || '—');
  addStat(stats, 'App version', game.version || '—');
  addStat(stats, 'Downloads', `${Number(game.downloads) || 0}`);

  const download = document.getElementById('detail-download');
  const downloadUrl = safeHttpUrl(game.downloadLink);
  if (downloadUrl) {
    download.href = downloadUrl;
    download.target = '_blank';
    download.rel = 'noopener noreferrer';
  } else {
    download.href = '#';
    download.setAttribute('aria-disabled', 'true');
    download.addEventListener('click', event => event.preventDefault());
  }
  document.getElementById('game-detail').hidden = false;
}

function startPage() {
  document.getElementById('current-year').textContent = new Date().getFullYear();
  const id = new URLSearchParams(window.location.search).get('id');
  try {
    const game = loadGames().find(item => String(item.id) === id && item.status === 'Active');
    if (game) showGame(game);
    else document.getElementById('not-found').hidden = false;
  } catch (error) {
    const message = document.getElementById('detail-error');
    message.textContent = `Unable to load game details: ${error.message}`;
    message.hidden = false;
    document.getElementById('not-found').hidden = false;
  }
}

document.addEventListener('DOMContentLoaded', startPage);
