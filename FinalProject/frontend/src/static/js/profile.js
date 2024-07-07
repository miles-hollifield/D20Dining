import api from "./apiClient.js";

// Selectors for user profile data
const avatarImage = document.querySelector('#avatar');
const firstNameInput = document.querySelector('#firstname');
const lastNameInput = document.querySelector('#lastname');
const usernameInput = document.querySelector('#username');
const emailInput = document.querySelector('#email');
const editBtn = document.querySelector('#editBtn');
const saveBtn = document.querySelector('#saveBtn');
const uploadPFPButton = document.querySelector('#imageUpload');
const uploadPFP = document.querySelector('#addPic');
const removePFP = document.querySelector('#removePic');

const DEFAULT_AVATAR_PATH = './images/default-avatar.jpg';
let newAvatar = '';

removePFP.addEventListener('click', (e) => {
    newAvatar = null;
    avatarImage.src = DEFAULT_AVATAR_PATH;
})

uploadPFPButton.addEventListener('change', (event) => {
    const file = event.target.files[0];
    // Handle the uploaded file here
    let reader = new FileReader();
    
    reader.onloadend = function() {
        newAvatar = reader.result;

        avatarImage.src = newAvatar;
    }
    reader.readAsDataURL(file);

});

// Function to toggle read-only state and button visibility
function toggleEditState(isEditing) {
    // Toggle input fields' editable state and button visibility
    [firstNameInput, lastNameInput, usernameInput, emailInput, uploadPFP, removePFP].forEach(input => {
        input.readOnly = !isEditing;
        input.classList.toggle('editable', isEditing);
    });

    editBtn.style.display = isEditing ? 'none' : 'block';
    saveBtn.style.display = isEditing ? 'block' : 'none';
    uploadPFP.style.display = isEditing ? 'block' : 'none';
    removePFP.style.display = isEditing ? 'block' : 'none';
}

// Event Listeners
editBtn.addEventListener('click', () => toggleEditState(true));
saveBtn.addEventListener('click', (event) => {
    saveProfileData();
    toggleEditState(false);
});

// Function to save profile data
function saveProfileData() {
    const updatedUser = {
        firstname: firstNameInput.value,
        lastname: lastNameInput.value,
        username: usernameInput.value,
        email: emailInput.value,
        avatar: newAvatar == null ? null : avatarImage.src
    };
    console.log("Updating user with data:", updatedUser);  // Log data being sent

    // API call to update user data on the server
    api.updateCurrentUser(updatedUser).then(() => {
        console.log('Profile updated successfully!');
    }).catch(error => {
        console.error('Failed to update profile:', error);
    });
}
 
// Function to fetch and display the current user's data
function displayUserProfile() {
    api.getCurrentUser().then(curUser => {
        api.getUserById(curUser.id).then( user => {
            firstNameInput.value = user.firstName;
            lastNameInput.value = user.lastName;
            usernameInput.value = user.username;
            emailInput.value = user.email;
            toggleEditState(false); // Make fields read-only initially
            
        })
        api.getProfilePic(curUser.id).then( pfp => {
            avatarImage.src = pfp || DEFAULT_AVATAR_PATH;
        })
    }).catch(error => {
        console.error('Failed to fetch user data:', error);
    });
}



// Initial display of user profile
displayUserProfile();
