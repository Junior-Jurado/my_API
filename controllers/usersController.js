const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

/**
 * Controlador que gestiona las operaciones relacionadas con los usuarios.
 */
module.exports = {
    /**
     * Obtiene todos los usuarios.
     * @param {Object} req - Objeto de solicitud HTTP.
     * @param {Object} res - Objeto de respuesta HTTP.
     * @param {Function} next - Función para pasar el control al siguiente manejador de middleware.
     * @returns {Object} Respuesta HTTP con los usuarios encontrados.
     */
    async getAll(req, res, next) {
        try {
            const data = await User.getAll(); 
            console.log(`Usuarios: ${data}`);
            return res.status(201).json({
                success: true,
                message: "Lista de usuarios",
                data: data
            });
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los usuarios'
            });
        }
    },

    /**
     * Registra un nuevo usuario.
     * @param {Object} req - Objeto de solicitud HTTP que contiene los datos del usuario a registrar.
     * @param {Object} res - Objeto de respuesta HTTP.
     * @param {Function} next - Función para pasar el control al siguiente manejador de middleware.
     * @returns {Object} Respuesta HTTP con el resultado del registro.
     */
    async register(req, res, next) {
        try {
            const user = req.body;
            const data = await User.create(user);

            const token = jwt.sign({id: data.id, email: user.email},
                keys.secretOrKey, {
                //expiresIn
            });
            

            const myData = {
                id: data.id,
                usuario: user.user_name,
                email: user.email,
                rol: user.rol,
                session_token: `JWT ${token}`
            };

            return res.status(201).json({
                success: true,
                message: 'El registro se realizó correctamente!!',
                data: myData
            });
        } catch (error) {
            console.log(`Error: ${error}`);
            if (error.code === '23505') {
                if (error.constraint === 'users_user_name_key') {
                    return res.status(400).json({ success: false, message: 'El nombre de usuario ya está en uso', error:error });
                } else if (error.constraint === 'users_email_key') {
                    return res.status(400).json({ success: false, message: 'El correo electrónico ya está en uso', error:error });
                }
            } else {
                console.error('Error al crear el usuario:', error);
                return res.status(500).json({ success: false, message: 'Hubo un error al registrar al usuario', error: error });
            }
        }
    },

    /**
     * Autentica a un usuario.
     * @param {Object} req - Objeto de solicitud HTTP que contiene los datos de inicio de sesión del usuario.
     * @param {Object} res - Objeto de respuesta HTTP.
     * @param {Function} next - Función para pasar el control al siguiente manejador de middleware.
     * @returns {Object} Respuesta HTTP con el resultado de la autenticación.
     */
    async login(req, res, next) {
        try {
            const email = req.body.email;
            const password = req.body.password;

            const myUser = await User.findByEmail(email);

            if (!myUser) {
                return res.status(401).json({
                    success: false,
                    message: 'Las credenciales son incorrectas'
                });
            }

            if (myUser) {
                const isPasswordValid = await bcrypt.compare(password, myUser.password);
            
                if (isPasswordValid) {
                    const token = jwt.sign({id: myUser.id, email: myUser.email},
                        keys.secretOrKey, {
                        //expiresIn
                    });

                    const data = {
                        id: myUser.id,
                        usuario: myUser.user_name,
                        email: myUser.email,
                        rol: myUser.rol,
                        session_token: `JWT ${token}`
                    };

                    await User.updateSessionToken(myUser.id, `JWT ${token}`);
                        
                    return res.status(201).json({
                        success: true,
                        message: 'El usuario ha sido autenticado',
                        data: data
                    });
                }
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
