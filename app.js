const testUsers = [
    {
        id: 1,
        login: "torvalds",
        name: "Linus Torvalds",
        avatar_url: "https://avatars.githubusercontent.com/u/1024588?v=4",
        bio: "Linux creator",
        followers: 200000,
        following: 0,
        public_repos: 50
    },
    {
        id: 2,
        login: "gvanrossum",
        name: "Guido van Rossum",
        avatar_url: "https://avatars.githubusercontent.com/u/6490553?v=4",
        bio: "Python creator",
        followers: 50000,
        following: 50,
        public_repos: 30
    }
];

// Repositories de test

const testRepos = [
    {
        name: "linux",
        description: "Linux kernel",
        language: "C",
        stargazers_count: 15000,
        forks_count: 2000,
        html_url: "https://github.com/torvalds/linux"
    },
    {
        name: "cpython",
        description: "Python interpreter",
        language: "C",
        stargazers_count: 50000,
        forks_count: 23000,
        html_url: "https://github.com/python/cpython"
    }
];

// État centralisé de l'application

const state = {
    currentUser: null,      // Utilisateur actuellement affiché
    bookmarks: [],          // Favoris sauvegardés
    isViewingBookmarks: false  // Affiche favoris ou résultats?
};

// Éléments principaux

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const userProfile = document.getElementById('userProfile');
const reposList = document.getElementById('reposList');
const welcomeState = document.getElementById('welcomeState');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const bookmarksList = document.getElementById('bookmarksList');
const bookmarkCount = document.getElementById('bookmarkCount');

// Affichage du profil utilisateur
// ─────────────────────────────────────────
 
function displayUserProfile(user) {
    // Sauvegarder l'utilisateur courant
    state.currentUser = user;
 
    // Mettre à jour les éléments du profil
    document.getElementById('avatar').src        = user.avatar_url;
    document.getElementById('name').textContent  = user.name || user.login;
    document.getElementById('login').textContent = '@' + user.login;
    document.getElementById('bio').textContent   = user.bio || 'Aucune bio disponible.';
    document.getElementById('followers').textContent   = formatNumber(user.followers);
    document.getElementById('following').textContent   = formatNumber(user.following);
    document.getElementById('public_repos').textContent = user.public_repos;
 
    const link = document.getElementById('github-link');
    link.href = 'https://github.com/' + user.login;
 
    // Mettre à jour le bouton favori
    updateBookmarkButtons();
 
    // Afficher la carte profil
    document.getElementById('result').classList.remove('hidden');
 
    // Masquer l'écran d'accueil / états alternatifs
    hideAllStates();
}
 
// ─────────────────────────────────────────
// Recherche d'un utilisateur
// ─────────────────────────────────────────
 
function searchUser() {
    const query = searchInput.value.trim().toLowerCase();
 
    if (!query) {
        showStatus('Veuillez entrer un nom d\'utilisateur.');
        return;
    }
 
    showLoading();
 
    // Simulation d'un appel API avec les données de test
    setTimeout(() => {
        const user = testUsers.find(u => u.login.toLowerCase() === query);
 
        hideLoading();
 
        if (user) {
            displayUserProfile(user);
            showStatus('');
        } else {
            showError('Utilisateur introuvable : ' + query);
        }
    }, 500);
}
 
// ─────────────────────────────────────────
// Gestion des favoris
// ─────────────────────────────────────────
 
function addBookmark() {
    if (!state.currentUser) return;
 
    const alreadySaved = state.bookmarks.some(b => b.id === state.currentUser.id);
    if (!alreadySaved) {
        state.bookmarks.push(state.currentUser);
        updateBookmarkCount();
        updateBookmarkButtons();
    }
}
 
function removeBookmark(userId) {
    state.bookmarks = state.bookmarks.filter(b => b.id !== userId);
    updateBookmarkCount();
    updateBookmarkButtons();
 
    // Rafraîchir la liste si on est dans l'onglet favoris
    if (state.isViewingBookmarks) {
        displayBookmarks();
    }
}
 
function displayBookmarks() {
    bookmarksList.innerHTML = '';
 
    if (state.bookmarks.length === 0) {
        bookmarksList.innerHTML = '<p class="empty-message">Aucun favori pour le moment.</p>';
        return;
    }
 
    state.bookmarks.forEach(user => {
        const card = document.createElement('div');
        card.className = 'bookmark-card';
        card.innerHTML = `
            <img src="${user.avatar_url}" alt="Avatar" class="avatar-small">
            <div class="bookmark-info">
                <strong>${user.name || user.login}</strong>
                <span class="login">@${user.login}</span>
                <span>${formatNumber(user.followers)} followers · ${user.public_repos} repos</span>
            </div>
            <button class="btn btn-danger" onclick="removeBookmark(${user.id})">🗑️ Retirer</button>
        `;
        bookmarksList.appendChild(card);
    });
}
 
function updateBookmarkButtons() {
    const btnAdd    = document.getElementById('bookmark-btn');
    const btnRemove = document.getElementById('remove-bookmark-btn');
 
    if (!state.currentUser || !btnAdd || !btnRemove) return;
 
    const isBookmarked = state.bookmarks.some(b => b.id === state.currentUser.id);
 
    btnAdd.classList.toggle('hidden', isBookmarked);
    btnRemove.classList.toggle('hidden', !isBookmarked);
}
 
function updateBookmarkCount() {
    if (bookmarkCount) {
        bookmarkCount.textContent = state.bookmarks.length;
    }
}
 
// ─────────────────────────────────────────
// Gestion des onglets
// ─────────────────────────────────────────
 
function showTab(tabName) {
    const searchSection    = document.getElementById('search-section');
    const bookmarksSection = document.getElementById('bookmarks-section');
    const tabSearch        = document.getElementById('tab-search');
    const tabBookmarks     = document.getElementById('tab-bookmarks');
 
    if (tabName === 'search') {
        searchSection.classList.remove('hidden');
        bookmarksSection.classList.add('hidden');
        tabSearch.classList.add('active');
        tabBookmarks.classList.remove('active');
        state.isViewingBookmarks = false;
    } else {
        searchSection.classList.add('hidden');
        bookmarksSection.classList.remove('hidden');
        tabSearch.classList.remove('active');
        tabBookmarks.classList.add('active');
        state.isViewingBookmarks = true;
        displayBookmarks();
    }
}
 
// ─────────────────────────────────────────
// États UI (loading / error / status)
// ─────────────────────────────────────────
 
function showLoading() {
    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('result').classList.add('hidden');
    hideAllStates();
}
 
function hideLoading() {
    document.getElementById('loader').classList.add('hidden');
}
 
function showError(message) {
    showStatus(message);
    document.getElementById('result').classList.add('hidden');
}
 
function showStatus(message) {
    const statusEl = document.getElementById('status');
    if (statusEl) statusEl.textContent = message;
}
 
function hideAllStates() {
    if (welcomeState) welcomeState.classList.add('hidden');
    if (loadingState) loadingState.classList.add('hidden');
    if (errorState)   errorState.classList.add('hidden');
}
 
// ─────────────────────────────────────────
// Utilitaires
// ─────────────────────────────────────────
 
function formatNumber(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000)    return (n / 1000).toFixed(1) + 'k';
    return n;
}
 
// ─────────────────────────────────────────
// Événements
// ─────────────────────────────────────────
 
searchBtn.addEventListener('click', searchUser);
 
searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') searchUser();
});
 
document.getElementById('tab-search').addEventListener('click', () => showTab('search'));
document.getElementById('tab-bookmarks').addEventListener('click', () => showTab('bookmarks'));
 
document.getElementById('bookmark-btn').addEventListener('click', addBookmark);
document.getElementById('remove-bookmark-btn').addEventListener('click', () => {
    if (state.currentUser) removeBookmark(state.currentUser.id);
});