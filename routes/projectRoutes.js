const ProjectsController = require('../controllers/projectsController');
const passport = require('passport')

module.exports = (app) => {
    
    app.post('/api/projects/create', passport.authenticate('jwt', {session: false}), ProjectsController.create);
}