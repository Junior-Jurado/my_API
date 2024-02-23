const ProjectsController = require('../controllers/projectsController');
const { app } = require('../server');

module.exports = (app) => {
    
    app.post('/api/projects/create', ProjectsController.createProject);
}