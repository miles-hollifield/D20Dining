import api from "./apiClient.js";

document.addEventListener("DOMContentLoaded", function() {
    // Fetch current user and then their sets
    api.getCurrentUser().then(user => {
        console.log("Current user ID:", user.id);
        if (user && user.id) {
            api.getSetsByUserId(1).then(response => { 
                console.log("Sets response:", response); 
                const sets = response; 
                populateSetsDropdown(sets);
            }).catch(error => console.error("Failed to fetch user's sets:", error));
        }
    }).catch(error => console.error("Failed to fetch current user:", error));
});

function populateSetsDropdown(sets) {
    const setsDropdown = document.querySelector('.custom-select');
    console.log("Populating sets dropdown with:", sets); 
    sets.forEach(set => {
        let option = document.createElement('option');
        option.value = set.setId; 
        option.textContent = set.setName; 
        setsDropdown.appendChild(option);
    });
}
