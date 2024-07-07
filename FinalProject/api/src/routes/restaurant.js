const apiRouter = require('express').Router();
const path = require('path');
const restaurantDAO = require(path.join(__dirname, '../../db/restaurantDAO.js'));


const NUMBER_OF_CATEGORIES = 10;

const GENERAL_TERM = 'restaurants';

const CATEGORIES = {
    restarants: 'restaurants',
    food: 'food'
}

const RADIUS_METERS = 10000;
const DEFAULT_LOCATION = 'raleigh';
const RETURN_LIMIT = 50;
const SORT_BY = {
    rating: "rating", 
    distance: "distance",
    best_match: "best_match",
    review_count: "review_count"
}


// https://docs.developer.yelp.com/reference/v3_business_search
apiRouter.get('/restaurants/search/:lat/:lon/:name', (req,res) => {
    let lat = req.params.lat;
    let lon = req.params.lon;
    let name = req.params.name;
    
    if(lat && lon && name) {
        requestRestaurants(`https://api.yelp.com/v3/businesses/search?categories=${CATEGORIES.restarants}&categories=${CATEGORIES.food}&latitude=${lat}&longitude=${lon}&term=${name}&radius=${RADIUS_METERS}&sort_by=${SORT_BY.best_match}&limit=${RETURN_LIMIT}`, res);
    } else {
        res.statusCode(500).send("Error: Missing Address Field")
    }

});

apiRouter.get('/restaurants/search/:name', (req,res) => {
    let name = req.params.name;
    
    if(name) {
        requestRestaurants(`https://api.yelp.com/v3/businesses/search?categories=${CATEGORIES.restarants}&categories=${CATEGORIES.food}&location=${DEFAULT_LOCATION}&term=${name}&radius=${RADIUS_METERS}&sort_by=${SORT_BY.best_match}&limit=${RETURN_LIMIT}`, res);
    } else {
        res.statusCode(500).send("Error: Missing Address Field")
    }

});

apiRouter.get('/restaurants/name/:restaurantName', (req, res) => {
    let name = req.params.restaurantName;
    
    if(name) {
        handleResponse(restaurantDAO.getRestaurantByName(name), res);
    } else {
        res.sendStatus(500).send('Internal Error, missing arguments');
    }

})

module.exports = apiRouter;




// Handle response uniformly
function handleResponse(promise, res) {
    promise.then(data => {
        res.json(data);
    }).catch(err => {
        console.error(err);
        res.status(500).json({ error: err.toString() });
    });
}

function requestRestaurants( url, res ) {
    const options = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${process.env.YELP_API_KEY}`
        }
    };
    
    try {
        fetch(url, options).then( response => {
            return response.json();
        }).then( response => {
            console.log("res", response);
            if (response && response.businesses) {
                const data = response.businesses.map(res => {
                    let cats = [];

                    for(let i = 0; i < Math.min(res.categories.length, NUMBER_OF_CATEGORIES); i++) {
                        cats.push(res.categories[i].title);
                    }
                    return {
                        name: res.name,
                        address: res.location.address1,
                        menuURL: res.attributes ? res.attributes.menu_url : 'N/A',
                        yelpURL: res.url,
                        phone: res.phone,
                        categories: cats,
                        image: res.image_url
                    }
                });
                console.log("data", data);
                res.send(data);
            } else {
                console.log("Try making another search, nothing found in your area.");
                throw new Error("No businesses found or invalid response.");
            }
        });
    } catch (error) {
        res.sendStatus(500).send("Internal Restaurant Searching Error");
    }

}