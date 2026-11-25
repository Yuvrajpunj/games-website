// Demo catalog shown on first visit. Admin-created games are stored in the same list.
const DEMO_GAMES = [
  {
    id: 'demo-rummy-01', name: 'Royal Rummy', category: 'Rummy', bonus: '₹1,000 welcome bonus',
    size: '48 MB', version: '2.4.1', downloads: 12500,
    shortDescription: 'Play exciting rummy tables, join tournaments, and sharpen your card skills.',
    description: 'Join Royal Rummy for friendly tables, daily challenges, and exciting tournaments. Practice your strategy, play with friends, and enjoy a polished rummy experience wherever you go.',
    downloadLink: 'https://example.com/', status: 'Active', featured: true, logo: '', banner: ''
  },
  {
    id: 'demo-patti-02', name: 'Teen Patti Royale', category: 'Teen Patti', bonus: '₹500 starter chips',
    size: '62 MB', version: '1.8.0', downloads: 9800,
    shortDescription: 'A lively Teen Patti experience with quick matches and classic tables.',
    description: 'Teen Patti Royale brings the familiar card-table experience to your phone. Choose a table, invite friends, and enjoy quick rounds with a clean interface and daily rewards.',
    downloadLink: 'https://example.com/', status: 'Active', featured: true, logo: '', banner: ''
  },
  {
    id: 'demo-ludo-03', name: 'Ludo Legends', category: 'Ludo', bonus: 'Daily login rewards',
    size: '35 MB', version: '3.2.0', downloads: 18700,
    shortDescription: 'Roll the dice, race your tokens, and challenge friends in Ludo.',
    description: 'Ludo Legends is made for friendly competition. Play classic matches, invite your friends, and unlock new boards as you race your tokens around the board.',
    downloadLink: 'https://example.com/', status: 'Active', featured: true, logo: '', banner: ''
  },
  {
    id: 'demo-slots-04', name: 'Neon Slots', category: 'Slots', bonus: '100 free spins',
    size: '54 MB', version: '1.5.3', downloads: 6400,
    shortDescription: 'Bright arcade-inspired reels, colorful themes, and daily missions.',
    description: 'Step into a neon arcade with a collection of colorful slot-style games, daily missions, and a lively soundtrack. Explore new themes and keep track of your personal milestones.',
    downloadLink: 'https://example.com/', status: 'Active', featured: false, logo: '', banner: ''
  },
  {
    id: 'demo-spin-05', name: 'Spin & Win', category: 'Spin', bonus: 'Welcome reward included',
    size: '41 MB', version: '1.2.6', downloads: 5200,
    shortDescription: 'Spin through playful prize wheels and collect daily rewards.',
    description: 'Spin & Win offers quick, casual prize-wheel rounds and a new daily challenge. Collect rewards, explore themed wheels, and enjoy bite-sized play sessions.',
    downloadLink: 'https://example.com/', status: 'Active', featured: false, logo: '', banner: ''
  },
  {
    id: 'demo-poker-06', name: 'Ace Poker Club', category: 'Poker', bonus: 'New player chip pack',
    size: '70 MB', version: '4.0.2', downloads: 11300,
    shortDescription: 'Join a friendly poker club and take on tables at your own pace.',
    description: 'Ace Poker Club gives you a welcoming place to enjoy poker-inspired play. Pick a table, learn at your own pace, and take part in regular club events.',
    downloadLink: 'https://example.com/', status: 'Active', featured: false, logo: '', banner: ''
  }
];

const STORAGE_KEY = 'games';
let allGames = [];
let selectedCategory = 'All';

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

function safeImageUrl(value) {
  if (!value) return '';
  try {
    const url = new URL(value, window.location.href);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

function createLogo(game, className = 'game-logo') {
  const logo = document.createElement('div');
  logo.className = className;
  const imageUrl = safeImageUrl(game.logo);
  if (imageUrl) {
    const image = document.createElement('img');
    image.src = imageUrl;
    image.alt = `${game.name} logo`;
    image.onerror = () => {
      image.remove();
      logo.textContent = (game.name || '?').slice(0, 1).toUpperCase();
    };
    logo.append(image);
  } else {
    logo.textContent = (game.name || '?').slice(0, 1).toUpperCase();
    logo.setAttribute('aria-label', `${game.name || 'Game'} logo placeholder`);
  }
  return logo;
}

function createGameCard(game) {
  const card = document.createElement('article');
  card.className = 'game-card';

  const top = document.createElement('div');
  top.className = 'game-card-top';
  top.append(createLogo(game));
  const titleGroup = document.createElement('div');
  titleGroup.className = 'game-title-group';
  const title = document.createElement('h3');
  title.textContent = game.name || 'Untitled game';
  const category = document.createElement('span');
  category.className = 'game-category';
  category.textContent = game.category || 'Other';
  titleGroup.append(title, category);
  top.append(titleGroup);
  if (game.featured) {
    const tag = document.createElement('span');
    tag.className = 'featured-tag';
    tag.textContent = '✦ FEATURED';
    top.append(tag);
  }

  const bonus = document.createElement('div');
  bonus.className = 'game-bonus';
  const bonusLabel = document.createElement('span');
  bonusLabel.textContent = 'Welcome bonus';
  const bonusValue = document.createElement('strong');
  bonusValue.textContent = game.bonus || 'See game for details';
  bonus.append(bonusLabel, bonusValue);

  const description = document.createElement('p');
  description.className = 'game-description';
  description.textContent = game.shortDescription || game.description || 'Discover this game on GameZone.';

  const meta = document.createElement('div');
  meta.className = 'game-meta';
  for (const value of [`${game.size || '—'}`, `v${game.version || '—'}`, `${Number(game.downloads) || 0} downloads`]) {
    const item = document.createElement('span');
    item.textContent = value;
    meta.append(item);
  }

  const actions = document.createElement('div');
  actions.className = 'card-actions';
  const details = document.createElement('a');
  details.className = 'details-link';
  details.href = `game.html?id=${encodeURIComponent(game.id)}`;
  details.textContent = 'View Details →';
  const download = document.createElement('a');
  download.className = 'button button-primary';
  const link = safeImageUrl(game.downloadLink);
  download.href = link || '#';
  download.target = '_blank';
  download.rel = 'noopener noreferrer';
  download.textContent = 'Download Now';
  if (!link) {
    download.setAttribute('aria-disabled', 'true');
    download.addEventListener('click', event => event.preventDefault());
  }
  actions.append(details, download);
  card.append(top, bonus, description, meta, actions);
  return card;
}

function renderGames() {
  const query = document.getElementById('game-search').value.trim().toLowerCase();
  const activeGames = allGames.filter(game => game.status === 'Active');
  const visibleGames = activeGames.filter(game => {
    const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
    const matchesSearch = `${game.name || ''} ${game.category || ''}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
  const featuredGames = visibleGames.filter(game => game.featured);
  const featuredSection = document.getElementById('featured-section');
  const featuredList = document.getElementById('featured-games');
  const allList = document.getElementById('all-games-list');
  featuredList.replaceChildren(...featuredGames.map(createGameCard));
  allList.replaceChildren(...visibleGames.map(createGameCard));
  featuredSection.hidden = featuredGames.length === 0;
  document.getElementById('empty-state').hidden = visibleGames.length > 0;
  document.getElementById('game-count').textContent = `${visibleGames.length} ${visibleGames.length === 1 ? 'game' : 'games'}`;
}

function startPage() {
  document.getElementById('current-year').textContent = new Date().getFullYear();
  try {
    allGames = loadGames();
    renderGames();
  } catch (error) {
    document.getElementById('storage-error').textContent = `Unable to load games: ${error.message}`;
    document.getElementById('storage-error').hidden = false;
    document.getElementById('empty-state').hidden = false;
  }

  document.getElementById('game-search').addEventListener('input', renderGames);
  document.getElementById('category-filters').addEventListener('click', event => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    selectedCategory = button.dataset.category;
    document.querySelectorAll('.filter-button').forEach(filter => {
      const active = filter === button;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    renderGames();
  });
}

document.addEventListener('DOMContentLoaded', startPage);
