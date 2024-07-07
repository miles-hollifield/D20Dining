const db = require('./dbConnection');
const SetEntry = require('./models/set_entry');

// SQL queries for SetEntry operations
const QUERIES = {
    GET_RESTAURANTS_IN_SET: `
        SELECT r.*, se.set_entry_id FROM restaurants r
        INNER JOIN set_entries se ON r.restaurant_id = se.restaurant_id
        WHERE se.set_id = ?`,
    ADD_TO_SET: 'INSERT INTO set_entries (set_id, restaurant_id) VALUES (?, ?)',
    REMOVE_FROM_SET: 'DELETE FROM set_entries WHERE set_entry_id = ?'
};

/**
 * Maps database result rows to SetEntry model objects.
 * @param {Object} result - The result row from the database.
 * @returns {SetEntry} - A new SetEntry instance.
 */
const mapToSetEntry = (result) => {
    return {
        setEntryId: result.set_entry_id,
        restaurantId: result.restaurant_id,
        restaurantName: result.restaurant_name,
        cuisine: result.restaurant_cuisine,
        website: result.restaurant_website
    };
};


const SetEntriesDAO = {
    /**
     * Retrieves all restaurants in a specific set.
     * @param {number} setId - The identifier for the set.
     * @returns {Promise<Array<SetEntry>>} - A promise that resolves with an array of SetEntry instances.
     */
    async getRestaurantsInSet(setId) {
        try {
            const results = await db.query(QUERIES.GET_RESTAURANTS_IN_SET, [setId]);
            return results.map(mapToSetEntry);
        } catch (error) {
            console.error("Error fetching restaurants in set:", error);
            throw error;
        }
    },

    /**
     * Adds a restaurant to a set.
     * @param {number} setId - The set's ID.
     * @param {number} restaurantId - The restaurant's ID.
     * @returns {Promise<SetEntry>} - A promise that resolves with the newly created SetEntry instance.
     */
    async addRestaurantToSet(setId, restaurantId) {
        try {
            const insertId = await db.query(QUERIES.ADD_TO_SET, [setId, restaurantId]);
            return new SetEntry({
                set_entry_id: insertId,
                set_id: setId,
                restaurant_id: restaurantId
            });
        } catch (error) {
            console.error("Error adding restaurant to set:", error);
            throw error;
        }
    },

    /**
     * Removes a restaurant from a set.
     * @param {number} setEntryId - The set's ID.
     * @returns {Promise<void>} - A promise that resolves when the restaurant is successfully removed.
     */
    async removeRestaurantFromSet(setEntryId) {
        try {
            const result = await db.query(QUERIES.REMOVE_FROM_SET, [setEntryId]);
            return result.affectedRows;
        } catch (error) {
            console.error("Error removing restaurant from set:", error);
            throw error;
        }
    }

};

module.exports = SetEntriesDAO;
