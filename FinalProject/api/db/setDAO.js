const db = require('./dbConnection');
const Set = require('./models/set');

// SQL queries for Set operations
const QUERIES = {
    GET_BY_USER_ID: 'SELECT * FROM sets WHERE user_id = ?',
    GET_BY_ID: 'SELECT * FROM sets WHERE set_id = ?',
    CREATE: 'INSERT INTO sets (user_id, set_name) VALUES (?, ?)',
    UPDATE: 'UPDATE sets SET set_name = ? WHERE set_id = ?',
    DELETE: 'DELETE FROM sets WHERE set_id = ?',
    addRestaurantToSet: 'INSERT INTO set_entries (set_id, restaurant_id) VALUES (?, ?)',
    DELETE_ALL_SETS_BY_USER: 'DELETE FROM sets WHERE user_id = ?',
    DELETE_ALL_ENTRIES_BY_USER: 'DELETE FROM set_entries WHERE set_id IN (SELECT set_id FROM sets WHERE user_id = ?)'
};

/**
 * Maps database results to Set model instances.
 * @param {Object} result - The database result row.
 * @returns {Set} - A new Set instance.
 */
const mapToSet = (result) => {
    return new Set(result);
};

const SetDAO = {
    /**
     * Retrieves all sets created by a specific user.
     * @param {number} userId - The user's ID.
     * @returns {Promise<Array<Set>>} - A promise that resolves to an array of Set instances.
     */
    async getSetsByUserId(userId) {
        try {
            const results = await db.query(QUERIES.GET_BY_USER_ID, [userId]);
            return results.map(mapToSet);
        } catch (error) {
            console.error("Error fetching sets by user ID:", error);
            throw error;
        }
    },

    /**
     * Fetches a specific set by its ID.
     * @param {number} setId - The set's ID.
     * @returns {Promise<Set>} - A promise that resolves to a Set instance.
     */
    async getSetById(setId) {
        try {
            const results = await db.query(QUERIES.GET_BY_ID, [setId]);
            if (results.length > 0) {
                return mapToSet(results[0]);
            } else {
                throw new Error('Set not found');
            }
        } catch (error) {
            console.error("Error fetching set by ID:", error);
            throw error;
        }
    },

    /**
     * Creates a new set for a user.
     * @param {number} userId - The user's ID.
     * @param {string} setName - The name of the new set.
     * @returns {Promise<Set>} - A promise that resolves to the newly created Set instance.
     */
    async createSet(userId, setName) {
        try {
            const insertId = await db.query(QUERIES.CREATE, [userId, setName]);
            return new Set({
                set_id: insertId,
                user_id: userId,
                set_name: setName
            });
        } catch (error) {
            console.error("Error creating set:", error);
            throw error;
        }
    },

    /**
     * Updates the name or other details of an existing set.
     * @param {number} setId - The set's ID.
     * @param {string} setName - The new name for the set.
     * @returns {Promise<Set>} - A promise that resolves to the updated Set instance.
     */
    async updateSet(setId, setName) {
        try {
            const { affectedRows } = await db.query(QUERIES.UPDATE, [setName, setId]);
            if (affectedRows > 0) {
                return new Set({
                    set_id: setId,
                    set_name: setName
                });
            } else {
                throw new Error('Set not found or no changes made');
            }
        } catch (error) {
            console.error("Error updating set:", error);
            throw error;
        }
    },

    /**
     * Deletes a set from the database.
     * @param {number} setId - The set's ID.
     * @returns {Promise<void>} - A promise that resolves when the set is successfully deleted.
     */
    async deleteSet(setId) {
        try {
            const result = await db.query(QUERIES.DELETE, [setId]);
            return result.affectedRows;
        } catch (error) {
            console.error("Error deleting set:", error);
            throw error;
        }
    },

    /**
     * Adds a restaurant to a specific set.
     * @param {number} setId - The identifier of the set to which the restaurant will be added.
     * @param {number} restaurantId - The identifier of the restaurant to add to the set.
     * @returns {Promise<void>} A promise that resolves when the restaurant has been successfully added to the set.
     * @throws {Error} Throws an error if the database query fails, including details of the error.
     */
    async addRestaurantToSet(setId, restaurantId) {
        console.log(`Adding restaurant ${restaurantId} to set ${setId}`);
        try {
            await db.query(QUERIES.addRestaurantToSet, [setId, restaurantId]);
            console.log('Addition successful');
            return;
        } catch (error) {
            console.error("Error adding restaurant to set:", error);
            throw error;
        }
    },
    
    /**
     * Deletes all sets and related set entries for a specific user.
     * This ensures that both sets and their entries are completely removed.
     * @param {number} userId - The user's ID.
     * @returns {Promise<void>} - A promise that resolves when the operation is complete.
     */
    async deleteAllSetsAndEntriesByUser(userId) {
        try {

            // First delete all set entries related to the user's sets
            await db.query(QUERIES.DELETE_ALL_ENTRIES_BY_USER, [userId]);

            // Then delete all sets owned by the user
            await db.query(QUERIES.DELETE_ALL_SETS_BY_USER, [userId]);

        } catch (error) {
            console.error("Error deleting all sets and set entries for user:", error);
            throw error;
        }
    }
    
};

module.exports = SetDAO;
