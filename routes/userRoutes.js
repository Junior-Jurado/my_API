const UsersController = require('../controllers/usersController');
//const passport = require('passport')

module.exports = (app) => {
    
    app.get('/api/users/getAll', UsersController.getAll);

    app.post('/api/users/create', UsersController.register);
    app.post('/api/users/login', UsersController.login);

    //app.post('/api/users/create', passport.authenticate('jwt', {session: false}). UsersController.register);
}