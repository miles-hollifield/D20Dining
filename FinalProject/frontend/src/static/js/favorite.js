import api from "./apiClient.js";

// Fetch and display the current user's data and their favorites
function displayUserProfile() {
    api.getCurrentUser().then(user => {
        if (user && user.id) {
            api.getUserFavorites(user.id).then(favorites => {
                populateFavoritesList(favorites, user.id); // Pass user ID to the function
            }).catch(error => console.error("Failed to fetch user's favorites:", error));
        }
    }).catch(error => console.error("Failed to fetch current user:", error));
}

// Populate the favorites list with interactive elements
function populateFavoritesList(favorites, userId) {
    const favoritesList = document.querySelector('.favorites-list');
    favoritesList.innerHTML = '';

    api.getSetsByUserId(userId).then(sets => {
        favorites.forEach(favorite => {
            const listItem = document.createElement('li');
            listItem.className = 'favorite-item d-flex flex-column align-items-start';

            const infoDiv = document.createElement('div');
            infoDiv.className = 'restaurant-info';

            const title = document.createElement('h2');
            title.textContent = favorite.restaurantName;

            const cuisine = document.createElement('p');
            cuisine.textContent = favorite.cuisine;

            // Action container for all buttons and dropdown
            const actionDiv = document.createElement('div');
            actionDiv.className = 'actions-container';

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'btn btn-danger btn-custom';
            deleteBtn.onclick = () => deleteFavorite(favorite.favoriteId);

            const addToSetDropdown = document.createElement('select');
            addToSetDropdown.className = 'custom-select';
            const defaultOption = document.createElement('option');
            defaultOption.textContent = 'Select set';
            addToSetDropdown.appendChild(defaultOption);
            sets.forEach(set => {
                const option = document.createElement('option');
                option.value = set.setId;
                option.textContent = set.setName;
                addToSetDropdown.appendChild(option);
            });

            const addToSetBtn = document.createElement('button');
            addToSetBtn.textContent = 'Add to Set';
            addToSetBtn.className = 'btn btn-primary btn-custom';
            addToSetBtn.onclick = () => addToSet(favorite.restaurantId, addToSetDropdown.value);

            // Append elements to the actions container
            actionDiv.appendChild(deleteBtn);
            actionDiv.appendChild(addToSetDropdown);
            actionDiv.appendChild(addToSetBtn);

            // Append all elements to the info div
            infoDiv.appendChild(title);
            infoDiv.appendChild(cuisine);
            infoDiv.appendChild(actionDiv);

            listItem.appendChild(infoDiv);
            favoritesList.appendChild(listItem);
        });
    }).catch(error => console.error("Failed to fetch sets:", error));
}


// Function to delete a favorite
function deleteFavorite(favoriteId) {
    if (confirm("Are you sure you want to delete this favorite? This action cannot be undone.")) {
        api.deleteFavorite(favoriteId).then(() => {
            console.log(`Favorite with ID ${favoriteId} deleted successfully.`);
            alert('Favorite deleted successfully.'); // Notify user of successful deletion
            displayUserProfile(); // Refresh the favorites list
        }).catch(error => {
            console.error('Failed to delete favorite:', error);
            alert('Failed to delete favorite.'); // Notify user of failure
        });
    }
}

// Function to add a restaurant to a set
function addToSet(restaurantId, setId) {
    if (setId == 'Select set') {
        alert('Please select a valid set from the list.');
        return;
    }
    if (setId) { // Check if the setId is valid
        api.addRestaurantToSet(setId, restaurantId).then(() => {
            console.log('Added to set successfully!');
            alert('Added to set successfully!'); // Notify user of successful addition
        }).catch(error => {
            console.error('Failed to add restaurant to set:', error);
            alert('Failed to add restaurant to set:', error); // Notify user of failure
        });
    } else {
        alert('Please select a valid set before adding.'); // Notify user if the set selection is invalid
    }
}
  


// Initial call to display user profile and favorites
displayUserProfile();
