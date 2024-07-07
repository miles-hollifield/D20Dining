const avatarImage = document.querySelector('#avatar');
const firstNameSpan = document.querySelector('#firstname');
const lastNameSpan = document.querySelector('#lastname');
const emailSpan = document.querySelector('#email');


import api from "./apiClient.js";

api.getCurrentUser().then( user => {
    console.log(user);
    avatarImage.src = user.avatar ? user.avatar : './images/avatar.jpg';
    firstNameSpan.innerHTML = user.firstName;
    lastNameSpan.innerHTML = user.lastName;
    emailSpan.innerHTML = user.email;
});