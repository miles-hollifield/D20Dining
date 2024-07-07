const crypto = require('crypto');

module.exports = class User {
    id = null;
    firstName = null;
    lastName = null;
    username = null;
    email = null;
    avatar = null;
    #passwordHash = null;
    #salt = null;

    constructor(data) {
        this.id = data.user_id;
        this.firstName = data.firstname;
        this.lastName = data.lastname;
        this.username = data.username;
        this.email = data.email;
        this.avatar = data.avatar;
        this.#salt = data.salt;
        this.#passwordHash = data.password;
    }

    validatePassword(password) {
        return new Promise((resolve, reject) => {     
            if(!this.#salt || !this.#passwordHash) {
                console.log("Salt or password hash is undefined.");
                return reject("Authentication error.");
            }
    
            crypto.pbkdf2(password, this.#salt, 100000, 64, 'sha512', (err, derivedKey) => {
                if (err) {
                    console.log("Error during password hashing:", err);
                    return reject("Error: " + err);
                }
                const digest = derivedKey.toString('hex');
                if (this.#passwordHash === digest) {
                    console.log("Password validated successfully.");
                    return resolve(true);
                } else {
                    console.log("Invalid username or password.");
                    return reject("Invalid username or password");
                }
            });
        });
    }

    toJSON() {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            username: this.username,
            email: this.email
        };
    }
};
