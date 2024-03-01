const request = require('supertest')
const app = require('..server')

/**
 * Testing get all users endpoint
 */
it('respond with json containing a List of all users', done => {
    request(app)
        .get('/api/users/getAll')

})
//describe
