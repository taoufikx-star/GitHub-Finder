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

function displayUserProfil (user){
  const avatar = document.getElementById("avatar");
  const nameEL = document.getElementById("name");
  const loginEL = document.getElementById("login");
  const bioEl = document.getElementById("bio");
  const followersEl = document.getElementById("followers");
  const followingEL = document.getElementById("following");
  const reposEL = document.getElementById("public_repos");
  const githubLink = document.getElementById("github-link");
  const resultCard = document.getElementById("result");
  if(ava)
}