# D20 Dining
## Group B: Milestone 2

### Summary
- What is Done
  - Logging in, signing up, seeing sets on home page, and various other features on the front and back end are complete.
- What is Not Done
  - Searching for a restaurant is not yet implemented. We will be tackling this feature in the next milestone.
  - Need to finish search, favorites, and sets fully.
  - Roll functionality needs to be done.
  - Logout button needs to be implemented.
  - Provide a more elegant solution to when the user has an invalid jwt cookie
- Authentication and Authorization Processes
  - Using JWT to create a token for the logged in user.
  - Backend endpoints where userdata is retreived requires authenticated user
  - Frontend endpoints displaying user information require validation
  - Without a valid JWT the user can only access login, signup endpoints
  - Each time a user accesses a authenticated endpoint, the authentication middleware ads a user field to the request, making it easy to access the current users information. 



Pages   | Status | Wireframe
------- | ------ | ---------
Login   | 100%     | [wireframe](/Proposal/Wireframes/d20_dining_login.png)
Profile | 90%     | [wireframe](/Proposal/Wireframes/d20_dining_profile.png)
Home    | 80%    |	[wireframe](/Proposal/Wireframes/d20_dining_home.png)
signup  | 100%     | [wireframe](/Proposal/Wireframes/d20_dining_login.png)
search  | 0%    |[wireframe](/Proposal/Wireframes/d20_dining_search.png)
favorites  | 50%    | [wireframe](/Proposal/Wireframes/d20_dining_favorites.png)
sets  | 80%    | [wireframe](/Proposal/Wireframes/d20_dining_sets.png)



List of API endpoints and their behavior (inputs and outputs):

Method | Route                      | Description
------ | -------------------------- | ----------------------------------------------
`POST` | `/login`                   | Receives an email and password for user authentication.
`POST` | `/register`                | Creates a new user account and returns the new user object.
`POST` | `/Users`                   | Adds a User to the database, returns the added user.
`GET`  | `/Users`                   | Retrieves an array of all active users in the system.
`GET`  | `/Users/id/:userId`           | Retrieves a user by its Id.
`GET`  | `/Users/:userId/followers` | Retrieves followers of a user by its Id.
`GET`  | `/Users/:userId/following` | Retrieves users followed by a user by its Id.
`GET`  | `/Users/:userId/favorites`| Retrieves favorite items of a user by its Id.
`GET`  | `/Users/:userId/sets`      | Retrieves sets created by a user by its Id.
`GET`  | `/Users/:userId/sets/:setName` | Retrieves a specific set created by a user by its Id and set name.

### Entity Relationship Diagram
![D20_Dining_ER_Diagram](https://media.github.ncsu.edu/user/28475/files/a06df9bd-0a32-41ea-9a46-119926b526ea)

### Team Member Contributions

#### Samuel Babak

* Files Setup
* Docker Setup
* Database


#### Miles Hollifield

* User Authentication
* Frontend functionality
* Dynamic display of data

#### Milestone Effort Contribution

Sam           |    Miles
------------- | -------------
50%            | 50%           
```

