const UserHistoriesController = require('../controllers/userHistoriesController');
const passport = require('passport');

module.exports = (app) => {
    
   
    app.post('/api/userHystory/create', passport.authenticate('jwt', {session: false}), UserHistoriesController.create);
    
}