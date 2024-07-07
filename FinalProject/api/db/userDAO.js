const db = require('./dbConnection');
const User = require('./models/user');

// SQL queries for User operations
const QUERIES = {
    getAllUsers: 'SELECT * FROM users',
    getUserById: 'SELECT * FROM users WHERE user_id=?',
    getUserByUsername: 'SELECT * FROM users WHERE username=?',
    createUser: 'INSERT INTO users (firstname, lastname, username, email, avatar, salt, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
    updateUser: 'UPDATE users SET firstname = ?, lastname = ?, username = ?, email = ?, avatar = ? WHERE user_id = ?'
};

/**
 * Retrieves all users from the database.
 * @returns {Promise<Array<User>>} A promise that resolves to an array of User instances.
 */
async function getUsers() {
    try {
        const results = await db.query(QUERIES.getAllUsers);
        return results.map(user => new User(user));
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

/**
 * Fetches a single user by user ID.
 * @param {number} userId - The ID of the user to retrieve.
 * @returns {Promise<User>} A promise that resolves to a User instance.
 */
async function getUser(userId) {
    try {
        const results = await db.query(QUERIES.getUserById, [userId]);
        if (results.length > 0) {
            return new User(results[0]);
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw error;
    }
}

/**
 * Fetches a user by their username.
 * @param {string} username - The username to search for.
 * @returns {Promise<User>} A promise that resolves to a User instance if found.
 */
async function getUserByUsername(username) {
    try {
        const results = await db.query(QUERIES.getUserByUsername, [username]);
        if (results.length > 0) {
            return new User(results[0]);
        } else {
            throw new Error("Can't find user with username: " + username);
        }
    } catch (error) {
        console.error("Error fetching user by username:", error);
        throw error;
    }
}

/**
 * Creates a new user in the database.
 * @param {Object} userInfo - An object containing user information.
 * @returns {Promise<User>} A promise that resolves to the newly created User instance.
 */
async function createUser(userInfo) {
    try {
        const insertId = await db.query(QUERIES.createUser, [
            userInfo.firstname,
            userInfo.lastname,
            userInfo.username,
            userInfo.email,
            userInfo.avatar,
            userInfo.salt,
            userInfo.password
        ]);
        return new User({...userInfo, user_id: insertId});
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}

/**
 * Authenticates a user by their username and password.
 * @param {string} username - The username of the user.
 * @param {string} password - The plaintext password to validate.
 * @returns {Promise<User>} A promise that resolves to the authenticated User instance if credentials are valid.
 */
async function getUserByCredentials(username, password) {
    try {
        const results = await db.query(QUERIES.getUserByUsername, [username]);
        if (results.length === 0) {
            throw new Error("User not found");
        }

        const user = new User(results[0]);
        const isValid = await user.validatePassword(password);
        if (isValid) {
            return user;
        } else {
            throw new Error("Invalid username or password");
        }
    } catch (error) {
        console.error("Error in getUserByCredentials:", error);
        throw error;
    }
}

/**
 * Updates user information in the database.
 * @param {number} userId - The ID of the user to update.
 * @param {Object} userInfo - An object containing the updated user information.
 * @returns {Promise<User>} - A promise that resolves to the updated User instance.
 */
async function updateUser(userId, userInfo) {
    try {
        const { firstname, lastname, username, email, avatar } = userInfo;
        await db.query(QUERIES.updateUser, [firstname, lastname, username, email, avatar, userId]);
        // After updating, fetch the updated user data to return
        const updatedUserResults = await db.query(QUERIES.getUserById, [userId]);
        if (updatedUserResults.length === 0) {
            throw new Error('User not found after update');
        }
        return new User(updatedUserResults[0]);
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
}

/**
 * Retrieves a user's profile picture from the database.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<string>} A promise that resolves to the URL of the user's profile picture.
 */
async function getUserProfilePicture(userId) {
    try {
        const results = await db.query(QUERIES.getUserById, [userId]);
        if (results.length > 0) {
            const user = new User(results[0]);
            return user.avatar;
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error("Error fetching user profile picture:", error);
        throw error;
    }
}

module.exports = {
    getUsers,
    getUser,
    getUserByUsername,
    getUserProfilePicture,
    createUser,
    getUserByCredentials,
    updateUser
};