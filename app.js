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

// ==================== ÉLÉMENTS DOM ====================

const searchInput    = document.getElementById('search-input')
const searchBtn      = document.getElementById('btn-search')
const btnBookmarks   = document.getElementById('btn-show-bookmarks')
const headerBadge    = document.getElementById('header-badge')
const viewWelcome    = document.getElementById('view-welcome')
const viewLoading    = document.getElementById('view-loading')
const viewError      = document.getElementById('view-error')
const viewResults    = document.getElementById('view-results')
const viewBookmarks  = document.getElementById('view-bookmarks')
const errorMessage   = document.getElementById('error-message')
const profileCard    = document.getElementById('profile-card')
const bookmarksList  = document.getElementById('bookmarks-list')
const bookmarksCount = document.getElementById('bookmarks-count')
const btnBack        = document.getElementById('btn-back')

