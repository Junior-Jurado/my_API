const UserHistoriesController = require('../controllers/userHistoriesController');
const passport = require('passport');

module.exports = (app) => {
    
   
    app.post('/api/userHistory/create', passport.authenticate('jwt', {session: false}), UserHistoriesController.create);
    app.post('/api/userHistory/update', passport.authenticate('jwt', {session: false}), UserHistoriesController.update);
    app.delete('/api/userHistory/delete', passport.authenticate('jwt', {session: false}), UserHistoriesController.delete);
    
}