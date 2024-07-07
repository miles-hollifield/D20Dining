const apiRouter = require('express').Router();

const url = 'https://documenu.p.rapidapi.com/restaurants/search/fields?restaurant_phone=5854420444';
const options = {
	method: 'GET',
	headers: {
		'x-api-key': '<REQUIRED>',
		'X-RapidAPI-Key': 'c4ff6c164amsh4e49c4a2cb0361fp1b2ba0jsnb638702e765a',
		'X-RapidAPI-Host': 'documenu.p.rapidapi.com'
	}
};

apiRouter.get('/restaurant', (req, res) => {
    let result;

    try {
        const response = fetch(url, options).
        then( res => {
            result = res.text();
        }).then( text => {
            console.log(result);
        });
    } catch (error) {
        console.error(error);
    }
})

module.exports = apiRouter;