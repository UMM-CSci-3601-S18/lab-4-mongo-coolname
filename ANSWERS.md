## Questions

1. :question: What do we do in the `Server` and `UserController` constructors
to set up our connection to the development database?
1. :question: How do we retrieve a user by ID in the `UserController.getUser(String)` method?
1. :question: How do we retrieve all the users with a given age 
in `UserController.getUsers(Map...)`? What's the role of `filterDoc` in that
method?
1. :question: What are these `Document` objects that we use in the `UserController`? 
Why and how are we using them?
1. :question: What does `UserControllerSpec.clearAndPopulateDb` do?
1. :question: What's being tested in `UserControllerSpec.getUsersWhoAre37()`?
How is that being tested?
1. :question: Follow the process for adding a new user. What role do `UserController` and 
`UserRequestHandler` play in the process?

## Your Team's Answers

1. Server class connect to Mongo DB, and UserController take data from Mongo DB and filter the data.

2. The ".find" method is called, which iterates over the entire DB to find the specific id.

3. To filter by user, a doc is created with all of the users on it. The "filterDoc" method then goes through and finds all users with the given name.

4. The document method is a data structure that stores json objects. It allows json objects made in typescript to be read and used in java.

5. The "UserControllerSpec.clearAndPopulateDb" clear the database and replace with orignal data. If the tests alters the database in any way, this makes sure it is reset.

6. Filter the age 37 people from data and iterate the entire json list to find matching.

7. UserRequestHandler creates a DB object and populates it with name, age, email, etc. UserController is then called to append the new user to the Document. 
