// Données de test - profils GitHub

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

const searchInput    = document.getElementById('search-input')
const searchBtn      = document.getElementById('btn-search')
const userProfile    = document.getElementById('profile-card')
const welcomeState   = document.getElementById('view-welcome')
const loadingState   = document.getElementById('view-loading')
const errorState     = document.getElementById('view-error')
const bookmarksList  = document.getElementById('bookmarks-list')
const bookmarkCount  = document.getElementById('bookmarks-count')

function displayUserProfile(user) {

    // Mettre à jour les éléments du profil
    userProfile.innerHTML =
        '<div class="profile-top">' +
            '<div class="avatar-wrap">' +
                '<div class="avatar-glow"></div>' +
                '<img src="' + user.avatar_url + '" alt="avatar"/>' +
            '</div>' +
            '<div class="profile-info">' +
                '<div class="profile-name">' + (user.name || user.login) + '</div>' +
                '<div class="profile-login">@' + user.login + '</div>' +
                (user.bio ? '<div class="profile-bio">' + user.bio + '</div>' : '') +
                '<div class="profile-actions">' +
                    '<a href="https://github.com/' + user.login + '" target="_blank" class="btn btn-ghost">↗ GitHub</a>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="stats-grid">' +
            '<div class="stat-box">' +
                '<div class="stat-value">' + user.public_repos + '</div>' +
                '<div class="stat-label">Repos</div>' +
            '</div>' +
            '<div class="stat-box">' +
                '<div class="stat-value">' + user.followers + '</div>' +
                '<div class="stat-label">Followers</div>' +
            '</div>' +
            '<div class="stat-box">' +
                '<div class="stat-value">' + user.following + '</div>' +
                '<div class="stat-label">Following</div>' +
            '</div>' +
        '</div>'

    // Afficher la carte profil
    userProfile.style.display = 'block'

    // Masquer l'écran d'accueil
    welcomeState.classList.remove('active')
    loadingState.classList.remove('active')
    errorState.classList.remove('active')
    document.getElementById('view-results').classList.add('active')

    // Sauvegarder dans state
    state.currentUser = user
}