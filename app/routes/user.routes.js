module.exports = app => {
    const user = require('../controllers/user.controller.js');

    // Create a new User
    app.post('/register', user.create);

    //Retrieve all Users
    app.get('/users', user.getUsers);

    //Authenticate User
    app.post('/login', user.login);

    //Get Single User
    app.get('/user/:userId', user.getUser);
};
