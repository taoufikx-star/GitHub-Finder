/* =========================================================
   GitHunt - app.js (CORRIGÉ)
   ========================================================= */

// ── 1. ÉLÉMENTS DU DOM ──────────────────────────────────
const searchInput      = document.getElementById('search-input');
const searchBtn        = document.getElementById('btn-search');
const profileCard      = document.getElementById('profile-card');
const bookmarksList    = document.getElementById('bookmarks-list');
const headerBadge      = document.getElementById('header-badge');
const bookmarksCount   = document.getElementById('bookmarks-count');
const errorMessage     = document.getElementById('error-message');

const btnShowBookmarks = document.getElementById('btn-show-bookmarks');
const btnBack          = document.getElementById('btn-back');

const views = {
  welcome:   document.getElementById('view-welcome'),
  loading:   document.getElementById('view-loading'),
  error:     document.getElementById('view-error'),
  results:   document.getElementById('view-results'),
  bookmarks: document.getElementById('view-bookmarks')
};

// ── 2. ÉTAT DE L'APPLICATION ────────────────────────────
let currentUser = null;
let favorites   = JSON.parse(localStorage.getItem('githunt_favorites') || '[]');

// ── 3. FONCTIONS UTILITAIRES ────────────────────────────
function hideAllViews() {
  Object.values(views).forEach(function(view) {
    view.classList.remove('active');
  });
}

function showView(viewName) {
  hideAllViews();
  views[viewName].classList.add('active');
}

function updateBadge() {
  var count = favorites.length;
  headerBadge.textContent = count;
  bookmarksCount.textContent = count;
  headerBadge.style.display = count > 0 ? 'inline' : 'none';
}

function isFavorite(login) {
  return favorites.some(function(fav) { return fav.login === login; });
}

function saveFavorites() {
  localStorage.setItem('githunt_favorites', JSON.stringify(favorites));
  updateBadge();
}

// ── 4. FAVORIS ──────────────────────────────────────────
function toggleFavorite(user) {
  if (isFavorite(user.login)) {
    favorites = favorites.filter(function(fav) { return fav.login !== user.login; });
  } else {
    favorites.push({
      id: user.id,
      login: user.login,
      name: user.name || user.login,
      avatar_url: user.avatar_url
    });
  }
  saveFavorites();
  if (currentUser && currentUser.login === user.login) {
    renderProfile(currentUser);
  }
}

function renderFavorites() {
  if (favorites.length === 0) {
    bookmarksList.innerHTML = '<div class="empty-state"><span class="empty-icon">☆</span>Aucun favori sauvegardé.</div>';
    return;
  }

  var html = '';
  favorites.forEach(function(fav) {
    html += '<div class="bookmark-item" data-login="' + fav.login + '">' +
              '<img class="bookmark-avatar" src="' + fav.avatar_url + '" alt="' + fav.login + '">' +
              '<div class="bookmark-info">' +
                '<div class="bookmark-name">' + fav.name + '</div>' +
                '<div class="bookmark-login">@' + fav.login + '</div>' +
              '</div>' +
              '<button class="btn btn-danger remove-fav" data-login="' + fav.login + '">✕</button>' +
            '</div>';
  });
  bookmarksList.innerHTML = html;

  var items = bookmarksList.querySelectorAll('.bookmark-item');
  for (var i = 0; i < items.length; i++) {
    items[i].addEventListener('click', function(e) {
      if (e.target.classList.contains('remove-fav')) return;
      searchInput.value = this.getAttribute('data-login');
      searchUser(this.getAttribute('data-login'));
    });
  }

  var removeBtns = bookmarksList.querySelectorAll('.remove-fav');
  for (var j = 0; j < removeBtns.length; j++) {
    removeBtns[j].addEventListener('click', function(e) {
      e.stopPropagation();
      var login = this.getAttribute('data-login');
      favorites = favorites.filter(function(fav) { return fav.login !== login; });
      saveFavorites();
      renderFavorites();
    });
  }
}

// ── 5. AFFICHAGE PROFIL ─────────────────────────────────
function renderProfile(user) {
  var favClass = isFavorite(user.login) ? 'is-fav' : '';
  var favText  = isFavorite(user.login) ? '★ Favori' : '☆ Ajouter';
  var bioHtml  = user.bio ? '<div class="profile-bio">' + user.bio + '</div>' : '';

  profileCard.innerHTML =
    '<div class="profile-top">' +
      '<div class="avatar-wrap">' +
        '<div class="avatar-glow"></div>' +
        '<img src="' + user.avatar_url + '" alt="Avatar">' +
      '</div>' +
      '<div class="profile-info">' +
        '<div class="profile-name">' + (user.name || user.login) + '</div>' +
        '<div class="profile-login">@' + user.login + '</div>' +
        bioHtml +
        '<div class="profile-actions">' +
          '<button class="btn btn-fav ' + favClass + '" id="btn-fav">' + favText + '</button>' +
          '<a href="https://github.com/' + user.login + '" target="_blank" class="btn btn-ghost">↗ GitHub</a>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="stats-grid">' +
      '<div class="stat-box"><div class="stat-value">' + (user.public_repos || 0) + '</div><div class="stat-label">Repos</div></div>' +
      '<div class="stat-box"><div class="stat-value">' + (user.followers || 0) + '</div><div class="stat-label">Followers</div></div>' +
      '<div class="stat-box"><div class="stat-value">' + (user.following || 0) + '</div><div class="stat-label">Following</div></div>' +
    '</div>';

  document.getElementById('btn-fav').addEventListener('click', function() {
    toggleFavorite(user);
  });

  currentUser = user;
  showView('results');
}

// ── 6. RECHERCHE (CORRIGÉE) ─────────────────────────────
function searchUser(username) {
  var input = username.trim().toLowerCase();
  
  if (!input) {
    errorMessage.textContent = 'Veuillez entrer un pseudo GitHub !';
    showView('error');
    return;
  }

  showView('loading');

  // Données locales pour la démo
  var testUsers = [
    { id: 1, login: "torvalds", name: "Linus Torvalds", avatar_url: "https://avatars.githubusercontent.com/u/1024588?v=4", bio: "Linux creator", followers: 200000, following: 0, public_repos: 50 },
    { id: 2, login: "gvanrossum", name: "Guido van Rossum", avatar_url: "https://avatars.githubusercontent.com/u/6490553?v=4", bio: "Python creator", followers: 50000, following: 50, public_repos: 30 }
  ];

  // Vérifier si c'est un utilisateur de test
  var localUser = null;
  for (var k = 0; k < testUsers.length; k++) {
    if (testUsers[k].login === input) {
      localUser = testUsers[k];
      break;
    }
  }

  if (localUser) {
    setTimeout(function() { 
      renderProfile(localUser); 
    }, 600);
    return;
  }

  // Appel API GitHub avec meilleure gestion d'erreurs
  fetch('https://api.github.com/users/' + input)
    .then(function(response) {
      console.log('Status:', response.status);
      
      if (response.status === 404) {
        throw new Error('Utilisateur non trouvé sur GitHub !');
      }
      
      if (response.status === 403) {
        throw new Error('Limite API GitHub atteinte. Réessayez dans quelques minutes.');
      }
      
      if (!response.ok) {
        throw new Error('Erreur API: ' + response.status);
      }
      
      return response.json();
    })
    .then(function(user) {
      console.log('User found:', user);
      renderProfile(user);
    })
    .catch(function(err) {
      console.error('Error:', err);
      
      // Message d'erreur plus précis
      var errorMsg = err.message;
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMsg = 'Impossible de contacter GitHub. Vérifiez votre connexion Internet.';
      }
      
      errorMessage.textContent = errorMsg;
      showView('error');
    });
}

// ── 7. ÉVÉNEMENTS ───────────────────────────────────────
searchBtn.addEventListener('click', function() {
  searchUser(searchInput.value);
});

searchInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    searchUser(searchInput.value);
  }
});

btnShowBookmarks.addEventListener('click', function() {
  if (views.bookmarks.classList.contains('active')) {
    if (currentUser) showView('results');
    else showView('welcome');
    btnShowBookmarks.classList.remove('active');
  } else {
    renderFavorites();
    showView('bookmarks');
    btnShowBookmarks.classList.add('active');
  }
});

btnBack.addEventListener('click', function() {
  if (currentUser) showView('results');
  else showView('welcome');
  btnShowBookmarks.classList.remove('active');
});

// ── 8. INITIALISATION ───────────────────────────────────
updateBadge();
showView('welcome');

// Test de connexion au chargement
window.addEventListener('load', function() {
  if (!navigator.onLine) {
    console.warn('⚠️  Vous êtes hors ligne');
  }
});

window.addEventListener('online', function() {
  console.log('✓ Connexion rétablie');
});

window.addEventListener('offline', function() {
  console.warn('⚠️  Connexion perdue');
});