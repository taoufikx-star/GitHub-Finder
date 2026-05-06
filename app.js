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
        '<button class="btn btn-fav ' + (isBookmarked(user.login) ? 'is-fav' : '') + '" id="btn-fav">' +
        (isBookmarked(user.login) ? '★ Favori' : '☆ Ajouter') +
        '</button>' +
        '<a href="https://github.com/' + user.login + '" target="_blank" class="btn btn-ghost">↗ GitHub</a>' +
        '</div></div></div>' +
        '<div class="stats-grid">' +
        '<div class="stat-box"><div class="stat-value">' + user.public_repos + '</div><div class="stat-label">Repos</div></div>' +
        '<div class="stat-box"><div class="stat-value">' + user.followers + '</div><div class="stat-label">Followers</div></div>' +
        '<div class="stat-box"><div class="stat-value">' + user.following + '</div><div class="stat-label">Following</div></div>' +
        '</div>'

    // ✅ FIX 1 — addEventListener btn-fav APRÈS innerHTML
    document.getElementById('btn-fav').addEventListener('click', function () {
        toggleBookmark(user)
    })

    userProfile.style.display = 'block'
    hideAll()
    document.getElementById('view-results').classList.add('active')
    state.currentUser = user
}

// ==================== 7. displayRepositories() ====================

function displayRepositories(repos) {
    reposList.innerHTML = ''
    repos.forEach(function (repo) {
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

// ==================== BOOKMARK FUNCTIONS ====================

function isBookmarked(login) {
    return state.bookmarks.some(function (b) {
        return b.login === login
    })
}

function toggleBookmark(user) {
    if (isBookmarked(user.login)) {
        state.bookmarks = state.bookmarks.filter(function (b) {
            return b.login !== user.login
        })
    } else {
        state.bookmarks.push({
            id: user.id,
            login: user.login,
            name: user.name || user.login,
            avatar_url: user.avatar_url
        })
    }
    saveBookmarks()
    updateBadge()
    displayUserProfile(user)
}

function saveBookmarks() {
    localStorage.setItem('githunt_bookmarks', JSON.stringify(state.bookmarks))
}

function updateBadge() {
    const count = state.bookmarks.length
    bookmarkCount.textContent = count
}

function initState() {
    const saved = localStorage.getItem('githunt_bookmarks')
    if (saved) {
        try {
            state.bookmarks = JSON.parse(saved)
        } catch (e) {
            state.bookmarks = []
        }
    }
    updateBadge()
}

// ==================== renderBookmarks() ====================

function renderBookmarks() {
    const count = state.bookmarks.length
    bookmarkCount.textContent = count

    if (count === 0) {
        bookmarksList.innerHTML =
            '<div class="empty-state">' +
            '<span class="empty-icon">☆</span>' +
            'Aucun favori sauvegardé.' +
            '</div>'
        return
    }

    bookmarksList.innerHTML = ''
    state.bookmarks.forEach(function (b) {
        bookmarksList.innerHTML +=
            '<div class="bookmark-item" data-login="' + b.login + '">' +
            '<img class="bookmark-avatar" src="' + b.avatar_url + '" alt="' + b.login + '"/>' +
            '<div class="bookmark-info">' +
            '<div class="bookmark-name">' + b.name + '</div>' +
            '<div class="bookmark-login">@' + b.login + '</div>' +
            '</div>' +
            '<button class="btn btn-danger remove-fav" data-login="' + b.login + '">✕</button>' +
            '</div>'
    })

    // Clic sur carte → recharger profil
    bookmarksList.querySelectorAll('.bookmark-item').forEach(function (item) {
        item.addEventListener('click', function (e) {
            if (e.target.classList.contains('remove-fav')) return
            searchInput.value = item.dataset.login
            searchUserLocal(item.dataset.login)
        })
    })

    // Clic ✕ → supprimer favori
    bookmarksList.querySelectorAll('.remove-fav').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation()
            state.bookmarks = state.bookmarks.filter(function (b) {
                return b.login !== btn.dataset.login
            })
            saveBookmarks()
            updateBadge()
            renderBookmarks()
        })
    })
}


// ==================== 8. searchUserLocal() ====================

function searchUserLocal(username) {

    const input = username.trim().toLowerCase()

    if (!input) {
        showError('Veuillez entrer un pseudo GitHub !')
        return
    }

    showLoading()

    const localUser = testUsers.find(function (u) {
        return u.login === input
    })

    if (localUser) {
        setTimeout(function () {
            const repos = testRepos.filter(function (r) {
                return r.html_url.includes(input)
            })
            displayUserProfile(localUser)
            displayRepositories(repos)
        }, 800)
        return
    }

    fetch('https://api.github.com/users/' + input)
        .then(function (response) {
            if (response.status === 404) {
                showError('Utilisateur non trouvé !')
                return
            }
            // ✅ FIX 2 — gestion 403 rate limit
            if (response.status === 403) {
                showError('Limite API GitHub atteinte — réessayez dans 1 heure !')
                return
            }
            if (!response.ok) {
                showError('Erreur réseau : ' + response.status)
                return
            }
            return response.json()
        })
        .then(function (user) {
            if (!user) return
            displayUserProfile(user)
            displayRepositories([])
        })
        .catch(function () {
            showError('Erreur réseau — vérifiez votre connexion !')
        })
}

// ==================== 9. EVENT LISTENERS ====================

searchBtn.addEventListener('click', function () {
    searchUserLocal(searchInput.value)
})

searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchUserLocal(searchInput.value)
    }
})

// Bouton Favoris dans header
document.getElementById('btn-show-bookmarks').addEventListener('click', function () {
    state.isViewingBookmarks = !state.isViewingBookmarks
    const btn = document.getElementById('btn-show-bookmarks')

    if (state.isViewingBookmarks) {
        renderBookmarks()
        hideAll()
        document.getElementById('view-bookmarks').classList.add('active')
        btn.classList.add('active')
    } else {
        btn.classList.remove('active')
        if (state.currentUser) {
            displayUserProfile(state.currentUser)
        } else {
            showWelcome()
        }
    }
})

// Bouton ← Retour
document.getElementById('btn-back').addEventListener('click', function () {
    state.isViewingBookmarks = false
    document.getElementById('btn-show-bookmarks').classList.remove('active')
    if (state.currentUser) {
        displayUserProfile(state.currentUser)
    } else {
        showWelcome()
    }
})

// ==================== 10. INITIALIZE ====================

// ✅ FIX 3 — initState() avant showWelcome()
initState()
showWelcome()