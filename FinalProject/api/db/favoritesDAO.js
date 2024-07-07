const db = require('./dbConnection');
const Favorite = require('./models/favorite');

// SQL queries for Favorites operations
const QUERIES = {
    GET_FAVORITES: `
        SELECT f.favorite_id, f.user_id, f.restaurant_id, r.restaurant_name, r.restaurant_cuisine
        FROM favorites f
        JOIN restaurants r ON f.restaurant_id = r.restaurant_id
        WHERE f.user_id = ?`,
    ADD_FAVORITE: 'INSERT INTO favorites (user_id, restaurant_id) VALUES (?, ?)',
    REMOVE_FAVORITE: 'DELETE FROM favorites WHERE favorite_id = ?',
    DELETE_ALL_FAVORITES_BY_USER: 'DELETE FROM favorites WHERE user_id = ?'
};

// Helper function to convert BigInts
function serializeBigInts(row) {
    return {
        ...row,
        favoriteId: row.favoriteId.toString(),
        userId: row.userId.toString(),
        restaurantId: row.restaurantId.toString()
    };
}

/**
 * Maps database result rows to Favorite model objects.
 * @param {Object} result - The result row from the database.
 * @returns {Favorite} - A new Favorite instance.
 */
const mapToFavorite = (result) => {
    const favorite = new Favorite({
        favoriteId: result.favorite_id,
        userId: result.user_id,
        restaurantId: result.restaurant_id,
        restaurantName: result.restaurant_name,
        cuisine: result.restaurant_cuisine
    });
    return favorite;
};


const FavoritesDAO = {

    /**
     * Checks if a specific restaurant is already a favorite for a given user.
     * @param {number} userId - The user's identifier.
     * @param {number} restaurantId - The restaurant's identifier.
     * @returns {Promise<boolean>} A promise that resolves with true if the restaurant is a favorite, otherwise false.
     */
    async checkIfFavorite(userId, restaurantId) {
        try {
            const results = await db.query(
                'SELECT 1 FROM favorites WHERE user_id = ? AND restaurant_id = ?',
                [userId, restaurantId]
            );
            return results.length > 0; // returns true if the restaurant is already a favorite
        } catch (error) {
            console.error("Error checking if restaurant is favorite:", error);
            throw error;
        }
    },
    /**
     * Retrieves all favorite restaurants for a specific user.
     * @param {number} userId - The user's identifier.
     * @returns {Promise<Array<Favorite>>} A promise that resolves with an array of Favorite instances.
     */
    async getUserFavorites(userId) {
        try {
            const results = await db.query(QUERIES.GET_FAVORITES, [userId]);
            if (results.length === 0) {
                console.log("No favorites found for this user.");
                return [];
            }
            return results.map(mapToFavorite);
        } catch (error) {
            console.error("Error fetching user favorites:", error);
            throw error;
        }
    },

    /**
     * Removes a restaurant from the user's list of favorites.
     * @param {number} favoriteId - The favorite's identifier to be removed.
     * @returns {Promise<void>} A promise that resolves when the favorite is successfully removed.
     */
    async deleteFavorite(favoriteId) {
        try {
            const affectedRows = await db.query(QUERIES.REMOVE_FAVORITE, [favoriteId]);
            if (affectedRows === 0) {
                throw new Error('Favorite not found');
            }
        } catch (error) {
            console.error("Error removing favorite:", error);
            throw error;
        }
    },

    /**
     * Deletes all favorites for a specific user.
     * @param {number} userId - The user's identifier.
     * @returns {Promise<void>} A promise that resolves when the favorite is successfully removed.
     */
    async deleteAllFavoritesOfUser(userId) {
        try {
            const { affectedRows } = await db.query(QUERIES.DELETE_ALL_FAVORITES_BY_USER, [userId]);
            return affectedRows;
        } catch (error) {
            console.error("Error deleting all favorites for user:", error);
            throw error;
        }
    },

    /**
     * Adds a restaurant to the user's list of favorites.
     * @param {number} userId - The user's identifier.
     * @param {number} restaurantId - The restaurant's identifier.
     * @returns {Promise<Favorite>} A promise that resolves with the new Favorite instance.
     */
    async addFavorite(userId, restaurantId) {
        try {
            const result = await db.query(
                QUERIES.ADD_FAVORITE,
                [userId, restaurantId]
            );
            return serializeBigInts({
                favoriteId: result.insertId,
                userId: userId,
                restaurantId: restaurantId
            });
        } catch (error) {
            console.error("Error adding favorite:", error);
            throw error;
        }
    }

};

module.exports = FavoritesDAO;
