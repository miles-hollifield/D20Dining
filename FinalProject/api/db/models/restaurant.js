module.exports = class Restaurant {
    restaurantId = null;
    name = null;
    cuisine = null;
    website = null;

    constructor(data) {
        this.restaurantId = data.restaurant_id;
        this.name = data.restaurant_name;
        this.cuisine = data.restaurant_cuisine;
        this.website = data.restaurant_website;
    }
};
