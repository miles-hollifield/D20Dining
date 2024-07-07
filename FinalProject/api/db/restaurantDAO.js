const db = require('./dbConnection');
const Restaurant = require('./models/restaurant');

// SQL queries for Restaurant operations
const QUERIES = {
    GET_ALL: 'SELECT * FROM restaurants',
    GET_BY_ID: 'SELECT * FROM restaurants WHERE restaurant_id = ?',
    GET_BY_NAME: 'SELECT * FROM restaurants WHERE restaurant_name = ?',
    CREATE: 'INSERT INTO restaurants (restaurant_name, restaurant_cuisine, restaurant_website) VALUES (?, ?, ?)',
    UPDATE: 'UPDATE restaurants SET restaurant_name = ?, restaurant_cuisine = ?, restaurant_website = ? WHERE restaurant_id = ?',
    DELETE: 'DELETE FROM restaurants WHERE restaurant_id = ?'
};

/**
 * Maps database result rows to Restaurant model objects.
 * @param {Object} result - The result row from the database.
 * @returns {Restaurant} - A new Restaurant instance.
 */
const mapToRestaurant = (result) => {
    return new Restaurant(result);
};

const RestaurantDAO = {
    /**
     * Retrieves all restaurants.
     * @returns {Promise<Array<Restaurant>>} A promise that resolves with an array of Restaurant instances.
     */
    async getRestaurants() {
        try {
            const results = await db.query(QUERIES.GET_ALL);
            return results.map(mapToRestaurant);
        } catch (error) {
            console.error("Error fetching restaurants:", error);
            throw error;
        }
    },

    /**
     * Fetches a single restaurant by its ID.
     * @param {number} restaurantId - The identifier for the restaurant.
     * @returns {Promise<Restaurant>} A promise that resolves with the Restaurant instance.
     */
    async getRestaurantById(restaurantId) {
        try {
            const results = await db.query(QUERIES.GET_BY_ID, [restaurantId]);
            if (results.length > 0) {
                return mapToRestaurant(results[0]);
            } else {
                throw new Error('Restaurant not found');
            }
        } catch (error) {
            console.error("Error fetching restaurant by ID:", error);
            throw error;
        }
    },

    /**
     * Fetches a restaurant by its name.
     * @param {number} restaurantName - The name for the restaurant.
     * @returns {Promise<Restaurant>} A promise that resolves with the Restaurant instance.
     */
    async getRestaurantByName(restaurantName) {
        try {
            const results = await db.query(QUERIES.GET_BY_NAME, [restaurantName]);
            if (results.length > 0) {
                return mapToRestaurant(results[0]);
            } else {
                throw new Error('Restaurant not found');
            }
        } catch (error) {
            console.error("Error fetching restaurant by ID:", error);
            throw error;
        }
    },

    /**
     * Creates a new restaurant in the database.
     * @param {Object} restaurantInfo - The information of the restaurant to create.
     * @returns {Promise<Restaurant>} A promise that resolves with the newly created Restaurant instance.
     */
    async createRestaurant(restaurantInfo) {
        try {
            const insertId = await db.query(QUERIES.CREATE, [restaurantInfo.restaurant_name, restaurantInfo.restaurant_cuisine, restaurantInfo.restaurant_website]);
            return new Restaurant({
                restaurant_id: insertId,
                ...restaurantInfo
            });
        } catch (error) {
            console.error("Error creating restaurant:", error);
            throw error;
        }
    },

    /**
     * Updates details of an existing restaurant.
     * @param {number} restaurantId - The identifier for the restaurant.
     * @param {Object} restaurantInfo - The updated information of the restaurant.
     * @returns {Promise<Restaurant>} A promise that resolves with the updated Restaurant instance.
     */
    async updateRestaurant(restaurantId, restaurantInfo) {
        try {
            const affectedRows = await db.query(QUERIES.UPDATE, [restaurantInfo.restaurant_name, restaurantInfo.restaurant_cuisine, restaurantInfo.restaurant_website, restaurantId]);
            if (affectedRows > 0) {
                return new Restaurant({
                    restaurant_id: restaurantId,
                    ...restaurantInfo
                });
            } else {
                throw new Error('Restaurant not found or no changes made');
            }
        } catch (error) {
            console.error("Error updating restaurant:", error);
            throw error;
        }
    },

    /**
     * Deletes a restaurant from the database.
     * @param {number} restaurantId - The identifier for the restaurant to be deleted.
     * @returns {Promise<void>} A promise that resolves when the restaurant is successfully deleted.
     */
    async deleteRestaurant(restaurantId) {
        try {
            const affectedRows = await db.query(QUERIES.DELETE, [restaurantId]);
            if (affectedRows === 0) {
                throw new Error('Restaurant not found');
            }
            // No need to return anything on successful deletion.
        } catch (error) {
            console.error("Error deleting restaurant:", error);
            throw error;
        }
    },

    /**
     * Finds a restaurant by name from the database.
     * @param {string} name - The name of the restaurant to be found.
     * @returns {Promise<Restaurant>} A promise that resolves when the restaurant is successfully found.
     */
    async findByName(name) {
        try {
            const results = await db.query('SELECT * FROM restaurants WHERE restaurant_name = ?', [name]);
            return results[0] || null;
        } catch (error) {
            console.error("Error finding restaurant by name:", error);
            throw error;
        }
    },

    /**
     * Creates a new restaurant in the database.
     * @param {Object} restaurantInfo - The information of the restaurant to create.
     * @returns {Promise<Restaurant>} A promise that resolves with the newly created Restaurant instance.
     */
    async createRestaurant(restaurantInfo) {
        try {
            const results = await db.query(QUERIES.CREATE, [
                restaurantInfo.restaurant_name, 
                restaurantInfo.restaurant_cuisine, 
                restaurantInfo.restaurant_website
            ]);
            const insertId = results.insertId;
            return new Restaurant({
                restaurant_id: insertId,
                restaurant_name: restaurantInfo.restaurant_name,
                restaurant_cuisine: restaurantInfo.restaurant_cuisine,
                restaurant_website: restaurantInfo.restaurant_website
            });
        } catch (error) {
            console.error("Error creating restaurant:", error);
            throw error;
        }
    }
};

module.exports = RestaurantDAO;
