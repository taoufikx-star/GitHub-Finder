// ==================== 1. DONNÉES DE TEST ====================

const testUsers = [
    {
        id: 1, login: "torvalds", name: "Linus Torvalds",
        avatar_url: "https://avatars.githubusercontent.com/u/1024588?v=4",
        bio: "Linux creator", followers: 200000, following: 0, public_repos: 50
    },
    {
        id: 2, login: "gvanrossum", name: "Guido van Rossum",
        avatar_url: "https://avatars.githubusercontent.com/u/6490553?v=4",
        bio: "Python creator", followers: 50000, following: 50, public_repos: 30
    }
]

const testRepos = [
    {
        name: "linux", description: "Linux kernel", language: "C",
        stargazers_count: 15000, forks_count: 2000, html_url: "https://github.com/torvalds/linux"
    },
    {
        name: "cpython", description: "Python interpreter", language: "C",
        stargazers_count: 50000, forks_count: 23000, html_url: "https://github.com/python/cpython"
    }
]
// ==================== 2. STATE ====================
const state = {
    currentUser: null,
    bookmarks: [],
    isViewingBookmarks: false
}

// ==================== 3. ÉLÉMENTS DOM ====================

const searchInput = document.getElementById('search-input')
const searchBtn = document.getElementById('btn-search')
const userProfile = document.getElementById('profile-card')
const reposList = document.getElementById('reposList')
const welcomeState = document.getElementById('view-welcome')
const loadingState = document.getElementById('view-loading')
const errorState = document.getElementById('view-error')
const bookmarksList = document.getElementById('bookmarks-list')
const bookmarkCount = document.getElementById('bookmarks-count')

// ==================== 4. hideAll() ====================

function hideAll() {
    welcomeState.classList.remove('active')
    loadingState.classList.remove('active')
    errorState.classList.remove('active')
    document.getElementById('view-results').classList.remove('active')
    document.getElementById('view-bookmarks').classList.remove('active')
    loadingState.style.display = 'none'
}

// ==================== 5. ÉTATS ====================

function showLoading() {
    hideAll()
    loadingState.classList.add('active')
    loadingState.style.display = 'flex'
}

function showError(message) {
    hideAll()
    errorState.classList.add('active')
    document.getElementById('error-message').textContent = message
}

function showWelcome() {
    hideAll()
    welcomeState.classList.add('active')
}

// ==================== 6. displayUserProfile() ===================