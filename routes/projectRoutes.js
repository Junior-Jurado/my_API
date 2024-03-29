const ProjectsController = require('../controllers/projectsController');
const passport = require('passport')

module.exports = (app) => {
    
    app.get('/api/projects/viewProjects/:id', passport.authenticate('jwt', {session: false}), ProjectsController.viewProjects)

    app.post('/api/projects/create', passport.authenticate('jwt', {session: false}), ProjectsController.create);
    app.post('/api/projects/addDev', passport.authenticate('jwt', {session: false}), ProjectsController.addDeveloper);

    app.delete('/api/projects/delDev', passport.authenticate('jwt', {session: false}), ProjectsController.deleteDeveloper);
}