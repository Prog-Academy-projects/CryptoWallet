const currentUser = localStorage.getItem("user");

if (!currentUser) {
    window.location.href = "../index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    // debugger
    const userNameEls = document.querySelectorAll(".currentUserName");
    userNameEls.forEach((e) => {
        console.log("User: ", e.value)
        if (e) {
        e.textContent = currentUser;
    }
    })
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
