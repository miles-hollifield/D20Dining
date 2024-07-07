import api from "./apiClient.js";

document.addEventListener("DOMContentLoaded", function() {
    // Fetch current user and then their favorites
    api.getCurrentUser().then(user => {
        console.log("Current user ID:", user.id);
        if (user && user.id) {
            api.getUserFavorites(1).then(favorites => {
                populateFavoritesList(favorites);
            }).catch(error => console.error("Failed to fetch user's favorites:", error));
        }
    }).catch(error => console.error("Failed to fetch current user:", error));
});

function populateFavoritesList(favorites) {
    const favoritesList = document.querySelector('.favorites-list');
    favoritesList.innerHTML = ''; // Clear the list before adding items

    favorites.forEach(favorite => {
        // Create list item for each favorite
        let listItem = document.createElement('li');
        listItem.className = 'favorite-item';

        let img = document.createElement('img');
        img.src = favorite.restaurantLogo || './images/placeholder-logo.png'; // Placeholder logo if none is provided
        img.alt = favorite.restaurantName;
        img.className = 'restaurant-logo';

        let infoDiv = document.createElement('div');
        infoDiv.className = 'restaurant-info';

        let title = document.createElement('h2');
        title.textContent = favorite.restaurantName;

        let description = document.createElement('p');
        description.textContent = favorite.restaurantType || "No category available"; // Placeholder text if none is provided

        infoDiv.appendChild(title);
        infoDiv.appendChild(description);

        let addButton = document.createElement('button');
        addButton.className = 'add-btn';
        addButton.innerHTML = '+';

        listItem.appendChild(img);
        listItem.appendChild(infoDiv);
        listItem.appendChild(addButton);

        favoritesList.appendChild(listItem);
    });
}
