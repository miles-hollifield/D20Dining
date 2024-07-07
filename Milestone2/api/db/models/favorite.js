module.exports = class Favorite {
    favoriteId = null;
    userId = null;
    restaurantId = null;

    constructor(data) {
        this.favoriteId = data.favorite_id;
        this.userId = data.user_id;
        this.restaurantId = data.restaurant_id;
    }
};
