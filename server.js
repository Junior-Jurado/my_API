const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors')
const passport = require('passport')

/*
* RUTAS
*/
const users = require('./routes/userRoutes');
const projects = require('./routes/projectRoutes');
const userHistories = require('./routes/userHistoryRoutes')
const tasks = require('./routes/taskRoutes');

const port  = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.disable('x-powered-by');

app.set('port', port);

// Llamando a las rutas
users(app);
projects(app);
userHistories(app);
tasks(app);

// server.listen(3000, '10.31.14.139' || 'localhost', function() {
//     console.log("API projects " + process.pid + " iniciada ...\nEn el puerto " + port)
// });

server.listen(port, function() {
    console.log("Listening on port " +  port)
});

// ERROR HANDLER
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
})

module.exports = {
    app: app,
    server: server
}