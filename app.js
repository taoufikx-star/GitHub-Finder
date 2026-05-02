// ==================== 1. DONNÉES DE TEST ====================

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
]

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
]

// ==================== 2. STATE ====================

const state = {
    currentUser: null,
    bookmarks: [],
    isViewingBookmarks: false
}

// ==================== 3. ÉLÉMENTS DOM ====================

const searchInput    = document.getElementById('search-input')
const searchBtn      = document.getElementById('btn-search')
const userProfile    = document.getElementById('profile-card')
const reposList      = document.getElementById('reposList')
const welcomeState   = document.getElementById('view-welcome')
const loadingState   = document.getElementById('view-loading')
const errorState     = document.getElementById('view-error')
const bookmarksList  = document.getElementById('bookmarks-list')
const bookmarkCount  = document.getElementById('bookmarks-count')

// ==================== 4. hideAll() ====================

function hideAll() {
    welcomeState.classList.remove('active')
    loadingState.classList.remove('active')
    errorState.classList.remove('active')
    document.getElementById('view-results').classList.remove('active')
}

// ==================== 5. ÉTATS ====================

function showLoading() {
    hideAll()
    loadingState.classList.add('active')
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

// ==================== 6. displayUserProfile() ====================

function displayUserProfile(user) {
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
            '<div class="stat-box"><div class="stat-value">' + user.public_repos + '</div><div class="stat-label">Repos</div></div>' +
            '<div class="stat-box"><div class="stat-value">' + user.followers + '</div><div class="stat-label">Followers</div></div>' +
            '<div class="stat-box"><div class="stat-value">' + user.following + '</div><div class="stat-label">Following</div></div>' +
        '</div>'

    userProfile.style.display = 'block'
    welcomeState.classList.remove('active')
    loadingState.classList.remove('active')
    errorState.classList.remove('active')
    document.getElementById('view-results').classList.add('active')
    state.currentUser = user
}

// ==================== 7. displayRepositories() ====================

function displayRepositories(repos) {
    reposList.innerHTML = ''
    repos.forEach(function(repo) {
        const repoCard =
            '<div class="repo-card">' +
                '<div class="repo-name">' + repo.name + '</div>' +
                '<div class="repo-desc">' + (repo.description || 'Pas de description') + '</div>' +
                '<div class="repo-stats">' +
                    '<span>⭐ ' + repo.stargazers_count + '</span>' +
                    '<span>🍴 ' + repo.forks_count + '</span>' +
                    '<span>💻 ' + (repo.language || 'N/A') + '</span>' +
                '</div>' +
                '<a href="' + repo.html_url + '" target="_blank">Voir le repo ↗</a>' +
            '</div>'
        reposList.innerHTML += repoCard
    })
}

// ==================== 8. searchUserLocal()  ====================


async function searchUserLocal(username) {

    // 1. Valider l'input — trim() enlève les espaces
    const input = username.trim().toLowerCase()

    if (!input) {
        showError('Veuillez entrer un pseudo GitHub !')
        return
    }

    // 2. Afficher le loader
    showLoading()

    // 3. Simuler un délai réseau de 800ms
    await new Promise(function(resolve) {
        setTimeout(resolve, 800)
    })

    // 4. Chercher le user dans testUsers avec find()
    const user = testUsers.find(function(u) {
        return u.login === input
    })

    // 5. Chercher ses repos dans testRepos
    const repos = testRepos.filter(function(r) {
        return r.html_url.includes(input)
    })

    // 6. User trouvé ou pas ?
    if (!user) {
        showError('Utilisateur non trouvé !')
        return
    }

    // 7. Afficher le profil + repos
    displayUserProfile(user)
    displayRepositories(repos)
}

// ==================== 9. EVENT LISTENERS —  ====================



// ==================== 10. INITIALIZE ====================
showWelcome()