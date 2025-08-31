if (localStorage.getItem("user")) {
    window.location.href = "./dashboard/index.html";
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("floatingInput").value.trim();
        const password = document.getElementById("floatingPassword").value.trim();

        if (email && password) {
            // localStorage.setItem("user", email);
            // window.location.href = "./dashboard/index.html";
            const userObj = {
                email: email,
                password: password,
                name: "",
                photo: ""
            };
            localStorage.setItem("user", JSON.stringify(userObj));
            window.location.href = "./dashboard/index.html";
        } else {
            alert("Please enter email & password!");
        }
    });
}
