const db = require('../config/config');
// Importa la librería bcrypt para el hash de contraseñas
const bcrypt = require('bcryptjs');

const User = {};

/**
 * Obtiene todos los usuarios de la base de datos.
 * @returns {Promise} Promesa que se resuelve con un array de objetos que representan los usuarios encontrados.
 */
User.getAll = () =>{
    const sql = `
    SELECT 
        *
    FROM 
        users
    `;
    return db.manyOrNone(sql);
}

/**
 * Crea un nuevo usuario en la base de datos.
 * @param {Object} user - Objeto que contiene los datos del usuario a crear.
 * @returns {Promise} Promesa que se resuelve con el ID del usuario creado.
 */
User.create = async (user) => {
    const hash = await bcrypt.hash(user.password, 10);

    const sql = `
    INSERT INTO 
        users(
            user_name,
            email,
            password,
            rol,
            created_at,
            updated_at
        )
    VALUES($1, $2, $3, $4, $5, $6) RETURNING id
    `;

    return db.oneOrNone(sql,[
        user.user_name,
        user.email,
        hash,
        user.rol,
        new Date(),
        new Date()
    ]);
}

/**
 * Busca un usuario por su correo electrónico o nombre de usuario en la base de datos.
 * @param {string} email - Correo electrónico o nombre de usuario del usuario a buscar.
 * @returns {Promise} Promesa que se resuelve con los datos del usuario encontrado, o null si no se encuentra.
 */
User.findByEmail = (email) => {
    const sql = `
    SELECT 
        id,
        user_name,
        email,
        password,
        rol,
        session_token
    FROM 
        users
    WHERE 
        email = $1 OR user_name = $1
    `;
    return db.oneOrNone(sql, email);
}

/**
 * Busca un usuario por su ID en la base de datos, incluyendo todos los campos.
 * @param {number} id - ID del usuario a buscar.
 * @returns {Promise} Promesa que se resuelve con los datos del usuario encontrado, o null si no se encuentra.
 */
User.findByIdPerRol = (id) => {
    const sql = `
    SELECT 
        *
    FROM 
        users
    WHERE 
        id = $1
    `;
    return db.oneOrNone(sql, id);
}

/**
 * Busca un usuario por su ID en la base de datos, excluyendo el campo de contraseña.
 * @param {number} id - ID del usuario a buscar.
 * @param {function} callback - Función de devolución de llamada que maneja el resultado de la consulta.
 * @returns {Promise} Promesa que se resuelve con los datos del usuario encontrado, o null si no se encuentra.
 */
User.findById = (id, callback) => {
    const sql = `
    SELECT 
        user_name,
        email,
        password,
        rol,
        session_token
    FROM 
        users
    WHERE 
        id = $1
    `;
    return db.oneOrNone(sql, id).then(user => { callback(null,user) });
}

/**
 * Actualiza el token de sesión de un usuario en la base de datos.
 * @param {number} id_user - ID del usuario cuyo token de sesión se actualizará.
 * @param {string} session_token - Nuevo token de sesión del usuario.
 * @returns {Promise} Promesa que indica la finalización de la operación.
 */
User.updateSessionToken = (id_user, session_token) => {
    const sql = `
    UPDATE
        users
    SET 
        session_token = $2
    WHERE
        id = $1
    `;
    return db.none(sql, [
        id_user,
        session_token
    ]);
}

module.exports = User;
