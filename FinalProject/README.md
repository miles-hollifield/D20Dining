# D20 Dining
## Group B: Final Project

### Summary
- What Works
  - Login / Logout / Sign up
  - Searching for a restaurant and saving to favorites
  - Ability to view, delete, and add favorite to a set
  - Ability to view, delete, and add sets, as well as delete restaurants saved to a set
  - Ability to view and edit user profile
  - Ability to select a set on the Home page and roll the die to be shown the randomly chosen restaurant
  - Ability to clear all saved data for the user
- What Does Not Work
  - Everything appears to be in working order
- Authentication and Authorization Processes
  - Using JWT to create a token for the logged in user.
  - Backend endpoints where userdata is retreived requires authenticated user
  - Frontend endpoints displaying user information require validation
  - Without a valid JWT the user can only access login, signup endpoints
  - Each time a user accesses a authenticated endpoint, the authentication middleware ads a user field to the request, making it easy to access the current users information. 

**Authentication and Authorization Processes**

To ensure secure access to user data, we are using JSON Web Tokens for authentication and authorization.

Here's how the process works:

1. When a user logs in, a JWT is generated and sent back to the client.
2. The client includes the JWT in the headers of subsequent requests to authenticated endpoints.
3. On the backend, we have middleware that verifies the JWT and extracts the user information from it.
4. This user information is then added to the request object, making it easily accessible in the route handlers.
5. Authenticated endpoints require a valid JWT to access, ensuring that only authorized users can retrieve or modify user data.

However, on our current implementation has a potential security vulnerability. If someone obtains a valid JWT, they can make any call to our backend and potentially delete other users' information.


Pages   | Status | Wireframe
------- | ------ | ---------
Login   | 100%     | [wireframe](/Proposal/Wireframes/d20_dining_login.png)
Profile | 100%     | [wireframe](/Proposal/Wireframes/d20_dining_profile.png)
Home    | 100%    |	[wireframe](/Proposal/Wireframes/d20_dining_home.png)
Signup  | 100%     | [wireframe](/Proposal/Wireframes/d20_dining_login.png)
Search  | 100%    |[wireframe](/Proposal/Wireframes/d20_dining_search.png)
Favorites  | 100%    | [wireframe](/Proposal/Wireframes/d20_dining_favorites.png)
Sets  | 100%    | [wireframe](/Proposal/Wireframes/d20_dining_sets.png)

List of API endpoints and their behavior (inputs and outputs):

Method | Route                                  | Description
------ | -------------------------------------- | ----------------------------------------------
`POST` | `/login`                               | Receives an email and password for user authentication.
`GET`  | `/users/logout`                        | Logs out the currently logged in user and invalidates the session.
`POST` | `/users/createAccount`                 | Creates a new user account and returns the new user object.
`GET`  | `/users/current`                       | Retrieves the currently logged in user.
`POST` | `/users`                               | Adds a User to the database, returns the added user.
`GET`  | `/users`                               | Retrieves an array of all users in the system.
`GET`  | `/users/id/:userId`                    | Retrieves a user by its Id.
`GET`  | `/users/:userId/followers`             | Retrieves followers of a user by its Id.
`GET`  | `/users/:userId/following`             | Retrieves users followed by a user by its Id.
`GET`  | `/restaurants/search/:lat/:lon/:name`  | Retrieves a list of restaurants based on latitude, longitude, and name/food type.
`GET`  | `/restaurants/search/:name`            | Retrieves a list of restaurants based on name/food type, this is centered in Raleigh.
`GET`  | `/restaurants/name/:restaurantName`    | Retrieves a restaurant by its name.
`GET`  | `/users/:userId/favorites`             | Retrieves all favorites for the currently authenticated user.
`POST` | `/favorites`                           | Adds a restaurant to favorites for the currently authenticated user.
`DELETE` | `/favorites/:favoriteId`             | Removes a restaurant from favorites for the currently authenticated user.
`POST` | `/favorites/add`                       | Adds a restaurant to favorites through search for the currently authenticated user.
`GET`  | `/users/:userId/sets`                  | Retrieves all sets for the currently authenticated user.
`GET`  | `/sets/:setId`                         | Retrieves a specific set by ID.
`POST` | `/sets`                                | Creates a new set.
`PUT`  | `/sets/:setId`                         | Updates an existing set.
`DELETE` | `/sets/:setId`                       | Deletes a set.
`GET`   | `/sets/:setId/restaurants`            | Retrieves all restaurants within a specified set.
`POST`  | `/sets/addRestaurant`                 | Adds a specified restaurant to a set.
`DELETE`| `/sets/restaurant/:setEntryId`        | Removes a specified restaurant from a set.


### Pages
- Login: This page allows users to log in to their accounts. This page does not offer any offline functionality, the user cannot get authenticated without accessing the server.
- Signup: This page allows new users to create an account. It does not provide offline functionality.
- Profile: This page displays the user's profile information. It provides offline functionality for viewing the profile if the user has previously accessed it.
- Home: This page serves as the main landing page of the app. It provides offline functionality for picking a random restaurant from any of the users sets.
- Search: This page allows users to search for restaurants using Yelp's Business API. The user can make the same searches they've made before if they are in the same location.
- Favorites: This page displays the user's favorite restaurants. It provides offline functionality for viewing favorite restaurants data.
- Sets: This page displays the user's custom sets of restaurants. It provides offline functionality for viewing set data.

### Caching Strategy
- Implement a caching strategy to enhance offline functionality for the application.
- Cache every HTTP request made by the user, allowing them to access previously fetched data even when offline.
- This caching strategy will provide users with an abundant amount of offline functionality, improving their overall experience.


### Entity Relationship Diagram
![D20_Dining_ER_Diagram](https://media.github.ncsu.edu/user/28475/files/a06df9bd-0a32-41ea-9a46-119926b526ea)

### Team Member Contributions

#### Samuel Babak

* Files Setup
* Docker Setup
* Database
* Integration of frontend and backend
* External API functionality

#### Miles Hollifield

* Frontend functionality
* Backend functionality
* Integration of frontend and backend
* Dynamic display of data from database

#### Milestone Effort Contribution

Milestone   | Team Member 1 | Team Member 2 
----------- | ------------- | ------------- 
Milestone 1 | 50%           | 50%            
Milestone 2 | 50%           | 50%            
Final       | 50%           | 50%            
----------- | ------------- | ------------- 
TOTAL:      | 50%           | 50%  

```

