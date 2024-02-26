const TasksController = require('../controllers/tasksController');
const passport = require('passport');

module.exports = (app) => {
    
   
    app.post('/api/task/create', passport.authenticate('jwt', {session: false}), TasksController.create);
    app.post('/api/task/assignment', passport.authenticate('jwt', {session: false}), TasksController.assignment);
    app.post('/api/task/update', passport.authenticate('jwt', {session: false}), TasksController.update);
    app.post('/api/task/updateState', passport.authenticate('jwt', {session: false}), TasksController.updateState);
    
    
    app.delete('/api/task/delete', passport.authenticate('jwt', {session: false}), TasksController.delete);


    
}