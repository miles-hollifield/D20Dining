import api from "./apiClient.js";

const loginButton = document.querySelector("#submitButton");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const errorBox = document.querySelector("#errorBox");

loginButton.addEventListener('click', e => {
    e.preventDefault();
    errorBox.classList.add("hidden");

    if(username.value.length < 1) {
        errorBox.classList.remove("hidden");
        errorBox.innerHTML = "Enter a Username";
    } else if(password.value.length < 1) {
        errorBox.classList.remove("hidden");
        errorBox.innerHTML = "Enter a Password";
    } else {
        api.login(username.value, password.value).then(userData => {
            document.location = "./home";
        }).catch((err) => {
            errorBox.classList.remove("hidden");
            if(err.status >= 400) {
                errorBox.innerHTML = "Invalid username or password";
            } else {
                errorBox.innerHTML = err;
            }
            });
    }

});