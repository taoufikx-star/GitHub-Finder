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

if (avatar) avatar.src = user.avatar_url || '';

    if (nameEl) nameEl.textContent = user.name || user.login;

    if (loginEl) loginEl.textContent = `@${user.login}`;

    if (bioEl) {
        bioEl.textContent = user.bio || "Aucune biographie disponible.";
    }

    if (followersEl) {
        followersEl.textContent = Number(user.followers).toLocaleString('fr-FR');
    }

    if (followingEl) {
        followingEl.textContent = Number(user.following).toLocaleString('fr-FR');
    }

    if (reposEl) {
        reposEl.textContent = Number(user.public_repos).toLocaleString('fr-FR');
    }

    if (githubLink) {
        githubLink.href = `https://github.com/${user.login}`;
    }
    state.currentUser = user;
    state.isViewingBookmarks = false;

    if (resultCard){
      resultCard.classList.remove ("hidden");
    }
    const bookmarksSection = document.getElementById ("bookmarks-section");
    if (bookmarksSection) bookmarksSection.classList.add ("hidden");
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("hidden");

    const bookmarkBtn = document.getElementById ("bookmark-btn");
    const removeBtn = document.getElementById("remove-bookmark-btn");
    if(bookmarkBtn) bookmarkBtn.classList.remove("hidden");
    if(removeBtn) removeBtn.classList.add("hidden");
  }