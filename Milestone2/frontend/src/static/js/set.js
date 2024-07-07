import api from "./apiClient.js";

document.addEventListener("DOMContentLoaded", function() {
    // Fetch current user and then their sets
    api.getCurrentUser().then(user => {
        console.log("Current user ID:", user.id);
        if (user && user.id) {
            api.getSetsByUserId(1).then(sets => {
                populateSetsList(sets);
            }).catch(error => console.error("Failed to fetch user's sets:", error));
        }
    }).catch(error => console.error("Failed to fetch current user:", error));
});

function populateSetsList(sets) {
    const setsList = document.querySelector('.sets-list');
    setsList.innerHTML = ''; // Clear the list before adding items

    sets.forEach(set => {
        // Create list item for each set
        let listItem = document.createElement('li');
        listItem.className = 'set-item d-flex justify-content-between align-items-center';

        let title = document.createElement('h2');
        title.className = 'set-title';
        title.textContent = set.setName;

        let editButton = document.createElement('button');
        editButton.className = 'edit-set-btn';
        editButton.innerHTML = '✎';

        listItem.appendChild(title);
        listItem.appendChild(editButton);

        setsList.appendChild(listItem);
    });
}
