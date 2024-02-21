const User = require('../models/usuario')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports = {
    async getAll(req, res, next) {
        try {
            const data = await User.getAll(); 
            console.log(`Usuarios: ${data}`);
            return res.status(201).json(data);
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los usuarios'
            });
        }
    },

    async register(req, res, next) {
        try {
            const user = req.body;
            const data = await User.create(user);

            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente!!',
                data: data.id
            });
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al registrar al usuario',
                error: error
            });
        }
    },

    async login(req, res, next) {
        try {
            //const user = req.body.usuario;
            const email = req.body.email;
            const password = req.body.contrasena;

            const myUserE = await User.findByEmail(email);

            if(!myUserE) {
                return res.status(401).json({
                    success: false,
                    message: 'Las credenciales son incorrectas'
                })
            }
            
            const isPasswordValid = await bcrypt.compare(password, myUserE.contrasena);
            
            if (isPasswordValid) {
                const token = jwt.sign({id: myUserE.id, email: myUserE.email},
                    keys.secretOrKey, {
                    //expiresIn
                })
                

                const data = {
                    id: myUserE.id,
                    usuario: myUserE.usuario,
                    email: myUserE.email,
                    rol: myUserE.rol,
                    session_token: `JWT ${token}`
                };

                
                return res.status(201).json({
                    success: true,
                    message: 'El usuario ha sido autenticado',
                    data: data
                });

            } else {
                return res.status(401).json({
                    success: false,
                    message: 'La contraseña es incorrecta'
                });
            }
            

        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al logear al usuario',
                error: error
            });
        }
    }
}