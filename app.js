/* ══════════════════════════════════════════════
   Chercheur de profils utilisateurs sur GitHub
   Version : 100% Vanilla JS (Sans jQuery)
   ══════════════════════════════════════════════ */

'use strict';

// ──────────────────────────────────────────────
//  STATE CENTRALISÉ
// ──────────────────────────────────────────────
const state = {
    currentUser: null,
    bookmarks: [],
    isLoading: false,
};

// ──────────────────────────────────────────────
//  CONSTANTES
// ──────────────────────────────────────────────
const STORAGE_KEY = 'gitfinder_bookmarks';
const GITHUB_API = 'https://api.github.com/users';
const VIEWS = ['welcome', 'loading', 'error', 'results'];

// ──────────────────────────────────────────────
//  HELPERS
// ──────────────────────────────────────────────

/** Échappe les caractères HTML pour éviter les injections */
function escHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/** Formate un entier en notation compacte (ex: 1200 → 1.2k) */
function fmt(n) {
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return String(n);
}

// ──────────────────────────────────────────────
//  GESTION DES VUES
// ──────────────────────────────────────────────

function showView(name) {
    VIEWS.forEach((v) => {
        const viewEl = document.getElementById('view-' + v);
        if (viewEl) {
            viewEl.classList.toggle('active', v === name);
        }
    });
}

// ──────────────────────────────────────────────
//  TOAST (notifications)
// ──────────────────────────────────────────────
let toastTimer;

function showToast(msg, icon = '✅') {
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').textContent = msg;
    document.getElementById('toast-icon').textContent = icon;
    
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ──────────────────────────────────────────────
//  API GITHUB
// ──────────────────────────────────────────────

async function fetchUser(username) {
    const res = await fetch(`${GITHUB_API}/${username}`);
    if (res.status === 404) throw new Error('404');
    if (!res.ok) throw new Error('network');
    return res.json();
}

// ──────────────────────────────────────────────
//  RECHERCHE
// ──────────────────────────────────────────────

async function search() {
    const input = document.getElementById('search-input');
    const username = input.value.trim();

    if (!username) {
        showToast("Entrez un nom d'utilisateur", '⚠️');
        return;
    }

    showView('loading');
    state.isLoading = true;

    try {
        const user = await fetchUser(username);
        state.currentUser = user;
        renderProfile(user);
        showView('results');
    } catch (err) {
        if (err.message === '404') {
            document.getElementById('error-title').textContent = 'Utilisateur introuvable';
            document.getElementById('error-msg').textContent = `Le profil "@${username}" n'existe pas.`;
        } else {
            document.getElementById('error-title').textContent = 'Erreur réseau';
            document.getElementById('error-msg').textContent = "Impossible de contacter l'API GitHub.";
        }
        showView('error');
    } finally {
        state.isLoading = false;
    }
}

// ──────────────────────────────────────────────
//  RENDU DU PROFIL
// ──────────────────────────────────────────────

function renderProfile(u) {
    const avatar = document.getElementById('r-avatar');
    avatar.src = u.avatar_url;
    avatar.alt = u.login;

    document.getElementById('r-name').textContent = u.name || u.login;
    document.getElementById('r-login').textContent = u.login;
    document.getElementById('r-bio').textContent = u.bio || 'Aucune biographie renseignée.';
    document.getElementById('r-repos').textContent = fmt(u.public_repos);
    document.getElementById('r-followers').textContent = fmt(u.followers);
    document.getElementById('r-following').textContent = fmt(u.following);
    document.getElementById('r-github-link').href = u.html_url;

    const meta = [];
    if (u.location) meta.push({ icon: icons.location(), text: u.location });
    if (u.company) meta.push({ icon: icons.company(), text: u.company });
    if (u.blog) meta.push({ icon: icons.link(), text: u.blog });
    if (u.twitter_username) meta.push({ icon: icons.twitter(), text: '@' + u.twitter_username });

    document.getElementById('r-meta').innerHTML = meta
        .map((m) => `<span class="meta-chip">${m.icon}${escHtml(m.text)}</span>`)
        .join('');

    updateBookmarkButton(u.login);
}

function updateBookmarkButton(login) {
    const isBm = state.bookmarks.some((b) => b.login === login);
    const btn = document.getElementById('r-bookmark-btn');

    if (isBm) {
        btn.className = 'btn btn-danger';
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" width="16"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg> Retirer`;
    } else {
        btn.className = 'btn btn-primary';
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg> Favori`;
    }
}

// ──────────────────────────────────────────────
//  FAVORIS (localStorage)
// ──────────────────────────────────────────────

function loadBookmarks() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        state.bookmarks = raw ? JSON.parse(raw) : [];
    } catch {
        state.bookmarks = [];
    }
}

function saveBookmarks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.bookmarks));
}

function toggleBookmark() {
    const u = state.currentUser;
    if (!u) return;

    const idx = state.bookmarks.findIndex((b) => b.login === u.login);

    if (idx === -1) {
        state.bookmarks.push({
            id: u.id,
            login: u.login,
            name: u.name,
            avatar_url: u.avatar_url,
        });
        showToast(`${u.login} ajouté`, '★');
    } else {
        state.bookmarks.splice(idx, 1);
        showToast(`${u.login} retiré`, '🗑️');
    }

    saveBookmarks();
    renderBookmarks();
    updateBookmarkButton(u.login);
}

// On définit globalement pour que le onclick du HTML puisse le trouver
window.removeBookmark = function(login, e) {
    e.stopPropagation();
    state.bookmarks = state.bookmarks.filter((b) => b.login !== login);
    saveBookmarks();
    renderBookmarks();
    showToast(`${login} retiré`, '🗑️');

    if (state.currentUser && state.currentUser.login === login) {
        updateBookmarkButton(login);
    }
};

function renderBookmarks() {
    const list = document.getElementById('bm-list');
    document.getElementById('bm-count').textContent = state.bookmarks.length;

    if (state.bookmarks.length === 0) {
        list.innerHTML = `<div class="bm-empty">Aucun favori.</div>`;
        return;
    }

    list.innerHTML = state.bookmarks
        .map(
            (b) => `
    <div class="bm-card" onclick="loadBookmark('${escHtml(b.login)}')">
      <img class="bm-avatar" src="${escHtml(b.avatar_url)}" />
      <div class="bm-info">
        <div class="bm-login">${escHtml(b.login)}</div>
      </div>
      <button class="bm-remove" onclick="removeBookmark('${escHtml(b.login)}', event)">
        &times;
      </button>
    </div>`
        )
        .join('');
}

window.loadBookmark = async function(login) {
    document.getElementById('search-input').value = login;
    await search();
};

// ──────────────────────────────────────────────
//  ICÔNES SVG
// ──────────────────────────────────────────────
const icons = {
    location: () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>`,
    company: () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>`,
    link: () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/></svg>`,
    twitter: () => `<svg viewBox="0 0 24 24" fill="currentColor" width="12"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z"/></svg>`,
};

// ──────────────────────────────────────────────
//  LIAISONS ÉVÉNEMENTS
// ──────────────────────────────────────────────
function bindEvents() {
    document.getElementById('search-btn').addEventListener('click', search);

    document.getElementById('search-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') search();
    });

    document.getElementById('r-bookmark-btn').addEventListener('click', toggleBookmark);

    document.querySelectorAll('.nav-tab').forEach((tab) => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.nav-tab').forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
}

// Initialisation
function init() {
    loadBookmarks();
    renderBookmarks();
    bindEvents();
}

init();