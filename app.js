// نجيبو العناصر من HTML
const input = document.getElementById("username-input");
const searchBtn = document.getElementById("search-btn");
const profileDiv = document.getElementById("profile");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const welcome = document.getElementById("welcome");

// ملي كنكليكو على زر البحث
searchBtn.addEventListener("click", () => {
    const username = input.value.toLowerCase();

    // نخبيو welcome
    welcome.classList.add("hidden");

    // نوريو loading
    loading.classList.remove("hidden");
    error.classList.add("hidden");
    profileDiv.classList.add("hidden");

    // simulation ديال loading
    setTimeout(() => {

        // نقلبو على user
        const user = testUsers.find(u => u.login === username);

        loading.classList.add("hidden");

        if (!user) {
            // إلا ما لقايناهش
            error.classList.remove("hidden");
            document.getElementById("error-title").textContent = "Utilisateur non trouvé";
            document.getElementById("error-message").textContent = "Ce profil n'existe pas.";
            return;
        }

        // إلا لقيناه
        showProfile(user);

    }, 1000);
});

// function باش نعرضو profile
function showProfile(user) {
    profileDiv.classList.remove("hidden");

    profileDiv.innerHTML = `
        <img src="${user.avatar_url}" width="100">
        <h2>${user.name}</h2>
        <p>@${user.login}</p>
        <p>${user.bio}</p>

        <div>
            <span>Followers: ${user.followers}</span>
            <span>Following: ${user.following}</span>
            <span>Repos: ${user.public_repos}</span>
        </div>

        <h3>Repositories:</h3>
        <ul>
            ${testRepos.map(repo => `
                <li>
                    <a href="${repo.html_url}" target="_blank">
                        ${repo.name}
                    </a>
                </li>
            `).join("")}
        </ul>
    `;
}