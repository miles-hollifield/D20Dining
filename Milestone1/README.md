# D20 Dining
## Group B: Milestone 1

### What is Done
✅ Part 1: Understanding and Running The Starter Code<br>
✅ Part 2: REST API Sketch<br>
✅ Part 3: Frontend First Pass (with some caveats)<br>
✅ Part 4: Milestone Report<br>

### What is Not Done
Currently, we are solely using Express as our routing method with no framework on the front-end. Despite not implementing React in this current iteration as stating in our proposal, we still intend to use the framework by the following milestone. We will be weighing the feasibility of this option as we continue developing our application.

We also intend to use an API endpoint from RapidAPI's "Documenu" for getting restaurants based on the user's zipcode.
Restaurant API: https://rapidapi.com/restaurantmenus/api/documenu/

### Example JSON Response
``` JSON
{
    "data": [
      {
        "address": {
          "city": "Brooklyn",
          "formatted": "547 Kings Highway Brooklyn, NY 11223",
          "postal_code": "11223",
          "state": "NY",
          "street": "547 Kings Highway"
        },
        "cuisines": [
          "French"
        ],
        "geo": {
          "lat": 40.60476,
          "lon": -73.96931
        },
        "hours": "",
        "last_updated": "2020-11-18T13:53:46.307Z",
        "menus": [],
        "price_range": "$$$",
        "restaurant_id": 4060476073969310,
        "restaurant_name": "Dolce Vita",
        "restaurant_phone": "(718) 376-8800",
        "restaurant_website": ""
      }
    ]
  }
```

### List of Pages

Pages   | Status | Wireframe
------- | ------ | ---------
Login   | ✅     | [wireframe](/Proposal/Wireframes/d20_dining_login.png)
Profile | 80%     | [wireframe](/Proposal/Wireframes/d20_dining_profile.png)
Home    | 80%    |	[wireframe](/Proposal/Wireframes/d20_dining_home.png)
signup  | ✅     | [wireframe](/Proposal/Wireframes/d20_dining_login.png)
search   |  80%    |[wireframe](/Proposal/Wireframes/d20_dining_search.png)
favorites  | 50%    | [wireframe1](/Proposal/Wireframes/d20_dining_favorites_1.png) [wireframe2](/Proposal/Wireframes/d20_dining_favorites_2.png)
sets  | 50%    | [wireframe](/Proposal/Wireframes/d20_dining_sets.png)



### API endpoints

Method | Route                      | Description
------ | -------------------------- | ----------------------------------------------
`POST` | `/login`                   | Receives an email and password for user authentication.
`POST` | `/register`                | Creates a new user account and returns the new user object.
`POST` | `/Users`                   | Adds a User to the database, returns the added user.
`GET`  | `/Users`                   | Retrieves an array of all active users in the system.
`GET`  | `/Users/:userId`           | Retrieves a user by its Id.
`GET`  | `/Users/:userId/followers` | Retrieves followers of a user by its Id.
`GET`  | `/Users/:userId/following` | Retrieves users followed by a user by its Id.
`GET`  | `/Users/:userId/favorites`| Retrieves favorite items of a user by its Id.
`GET`  | `/Users/:userId/sets`      | Retrieves sets created by a user by its Id.
`GET`  | `/Users/:userId/sets/:setName` | Retrieves a specific set created by a user by its Id and set name.

### Team Member Contributions

#### Samuel Babak

* API Routes
* Frontend routes
* User Data Acess Object
* Sample Data Construction


#### Miles Hollifield

* Implemented all HTML pages
* Designed and styling for html pages
* Sample Data Construction

#### Milestone Effort Contribution

Sam           |    Miles
------------- | -------------
50%            | 50%           
