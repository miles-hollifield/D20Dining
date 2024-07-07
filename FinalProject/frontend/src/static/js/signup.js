import api from "./apiClient.js";

const signUpButton = document.querySelector("#submitButton");
const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const passwordConfirm = document.querySelector("#confirm-password");
const firstname = document.querySelector("#first-name");
const lastname = document.querySelector("#last-name");
const errorBox = document.querySelector("#errorBox");

signUpButton.addEventListener('click', e => {
    e.preventDefault();
    errorBox.textContent = ""; // Clear previous errors
    errorBox.classList.add("hidden");

    // Basic validation checks
    if(!username.value) {
        showError("Enter a Username");
    } else if(!email.value) {
        showError("Enter an Email");
    } else if(password.value !== passwordConfirm.value) {
        showError("Passwords do not match");
    } else if(!firstname.value) {
        showError("Enter a First Name");
    } else if(!lastname.value) {
        showError("Enter a Last Name");
    } else {
        // Prepare the data for the API call
        const userData = {
            username: username.value,
            email: email.value,
            password: password.value,
            firstname: firstname.value,
            lastname: lastname.value,
            avatar: '',
        };

        // Call the signup function from apiClient
        api.signup(userData)
            .then(() => {
                window.location.href = "./"; // Redirect to login page after successful signup
            })
            .catch((err) => {
                showError(err.statusText || "An error occurred during signup");
            });
    }

    function showError(message) {
        errorBox.textContent = message;
        errorBox.classList.remove("hidden");
    }
});
