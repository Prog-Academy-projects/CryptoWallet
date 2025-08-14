const currentUser = localStorage.getItem("user");

if (!currentUser) {
    window.location.href = "../index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const userNameEl = document.getElementById("currentUserName");
    if (userNameEl) {
        userNameEl.textContent = currentUser;
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtns = document.querySelectorAll(".logoutBtn");
    logoutBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("user");
            window.location.href = "../index.html";
        });
    });
});
