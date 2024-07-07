import api from "./apiClient.js";

let currentUser;

document.addEventListener("DOMContentLoaded", function() {
    api.getCurrentUser().then(user => {
        if (user && user.id) {
            currentUser = user; // Store the current user globally
            api.getSetsByUserId(user.id).then(sets => {
                populateSetsList(sets);
            }).catch(error => console.error("Failed to fetch user's sets:", error));
        }
    }).catch(error => console.error("Failed to fetch current user:", error));

});

document.getElementById('addSetBtn').addEventListener('click', function() {
    const setName = prompt("Please enter the name of the new set:");
    if (setName) { // If the user pressed OK and the input is not empty
        if (currentUser && currentUser.id) {
            api.addSet(setName, currentUser.id).then(() => {
                alert('Set added successfully!');
                // Reload or update the set list without reloading the page
                api.getSetsByUserId(currentUser.id).then(sets => {
                    populateSetsList(sets);
                });
            }).catch(error => {
                console.error('Failed to add set:', error);
                alert('Failed to add set.');
            });
        } else {
            alert('User ID missing, please reload the page.');
        }
    } else if (setName === "") {
        // If the user pressed OK but the input is empty
        alert("Set name cannot be empty.");
    }
    // If the user pressed Cancel, setName will be null, and nothing happens.
});


function populateSetsList(sets) {
    const setsList = document.querySelector('.sets-list');
    setsList.innerHTML = ''; // Clear the list before adding items

    sets.forEach(set => {
        let listItem = document.createElement('li');
        listItem.className = 'set-item d-flex flex-column align-items-start';
    
        let title = document.createElement('h2');
        title.className = 'set-title';
        title.textContent = set.setName;
        title.dataset.setId = set.setId; // Storing set ID in the data attribute
        title.addEventListener('click', () => toggleRestaurants(title, listItem));
    
        let restaurantList = document.createElement('ul');
        restaurantList.className = 'restaurants-list hidden';

        listItem.appendChild(title);
        listItem.appendChild(restaurantList); // Add the list to the set item
        setsList.appendChild(listItem);
    });
}

function toggleRestaurants(title, listItem) {
    const restaurantList = listItem.querySelector('.restaurants-list');

    if (restaurantList.classList.contains('hidden')) {
        restaurantList.classList.remove('hidden');
        populateRestaurantList(restaurantList, title.dataset.setId, listItem);
    } else {
        restaurantList.classList.add('hidden');
        restaurantList.innerHTML = ''; // Clear the list
    }
}

function populateRestaurantList(restaurantList, setId, listItem) {
    if (restaurantList.innerHTML === '') {
        api.getRestaurantsInSet(setId).then(restaurants => {
            restaurants.forEach(restaurant => {
                let li = document.createElement('li');
                li.className = 'ml-3'
                li.textContent = `${restaurant.restaurantName} (${restaurant.cuisine})`;
                let deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.className = 'btn btn-danger m-2';
                deleteBtn.onclick = () => deleteRestaurantFromSet(restaurant.setEntryId, li);
                li.appendChild(deleteBtn);
                restaurantList.appendChild(li);
            });
            appendDeleteSetButton(restaurantList, setId, listItem);
        }).catch(err => console.error("Error loading restaurants:", err));
    }
}

function appendDeleteSetButton(restaurantList, setId, listItem) {
    let deleteSetButton = document.createElement('button');
    deleteSetButton.className = 'btn btn-danger mt-2';
    deleteSetButton.textContent = 'Delete Entire Set';
    deleteSetButton.onclick = () => deleteSet(setId, listItem);
    restaurantList.appendChild(deleteSetButton); // Add the delete set button at the end of the list
}

function deleteRestaurantFromSet(setEntryId, listItem) {
    if (confirm("Are you sure you want to remove this restaurant from the set? This action cannot be undone.")) {
        api.deleteRestaurantFromSet(setEntryId).then(() => {
            listItem.remove();
            alert('Restaurant removed successfully.');
        }).catch(err => {
            console.error("Failed to delete restaurant:", err);
            alert('Failed to remove restaurant.');
        });
    }
}


function deleteSet(setId, listItem) {
    if (confirm("Are you sure you want to delete this set?")) {
        api.deleteSet(setId).then(() => {
            listItem.remove();
            alert('Set deleted successfully.');
        }).catch(err => {
            console.error("Failed to delete set:", err);
            alert('Failed to delete set.');
        });
    }
}
