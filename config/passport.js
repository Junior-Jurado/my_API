const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user'); // Importa el modelo de usuario (asegúrate de tenerlo definido)
const Keys = require('./keys'); // Importa las claves (asegúrate de tenerlas definidas)

/**
 * Configuración de la estrategia JWT para la autenticación mediante Passport.
 * @param {Object} passport - El objeto Passport que se utiliza para configurar la estrategia.
 */
module.exports = function(passport) {

    // Opciones de configuración para la estrategia JWT
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt'); // Extrae el token JWT del encabezado de autorización
    opts.secretOrKey = Keys.secretOrKey; // Clave secreta para verificar la firma del token JWT

    // Configuración de la estrategia JWT con Passport
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        
        // Busca al usuario en la base de datos utilizando el ID del payload del token JWT
        User.findById(jwt_payload.id, (err, user) => {
            if (err) {
                // Si hay un error, devuelve el error y un usuario falso
                return done(err, false);
            }
            if (user) {
                // Si el usuario se encuentra, devuelve el usuario sin error
                return done(null, user);
            }
            else {
                // Si no se encuentra el usuario, devuelve un usuario falso sin error
                return done(null, false);
            }
        });
    }));
};
