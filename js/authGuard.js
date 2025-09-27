let storedUser = null;

try {
    const userStr = localStorage.getItem("user");
    storedUser = userStr ? JSON.parse(userStr) : null;
} catch (e) {
    console.error("Error user parser from localStorage:", e);
    storedUser = null;
}

// const storedUser = JSON.parse(localStorage.getItem("user"));

if (!storedUser) {
    window.location.href = "../index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    // debugger
    const displayName = storedUser.name || storedUser.email;

    const userNameEls = document.querySelectorAll(".currentUserName");
    userNameEls.forEach((e) => {
        console.log("User: ", e.value)
        if (e) e.textContent = displayName;
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
