const db = require('../config/config');
const bcrypt = require('bcryptjs')


const User = {};

User.getAll = () =>{
    const sql = `
    SELECT 
        *
    FROM 
        usuarios
    `;

    return db.manyOrNone(sql);
}

User.create = async (user) => {

    const hash = await bcrypt.hash(user.contrasena, 10);

    const sql = `
    INSERT INTO 
        usuarios(
            usuario,
            email,
            contrasena,
            rol,
            created_at,
            updated_at
        )
    VALUES($1, $2, $3, $4, $5, $6) RETURNING id
    `;

    return db.oneOrNone(sql,[
        user.usuario,
        user.email,
        hash,
        user.rol,
        new Date(),
        new Date()
    ]);
}

User.findByEmail = (email) => {
    const sql = `
    SELECT 
        id,
        usuario,
        email,
        contrasena,
        rol,
        session_token
    FROM 
        usuarios
    WHERE 
        email = $1
    `;
    return db.oneOrNone(sql, email);
}

User.findByUser = (usuario) => {
    const sql = `
    SELECT 
        usuario,
        email,
        contrasena,
        rol,
        session_token
    FROM 
        usuarios
    WHERE 
        usuario = $1
    `;
    return db.oneOrNone(sql, usuario);
}

User.findById = (id, callback) => {
    const sql = `
    SELECT 
        usuario,
        email,
        contrasena,
        rol,
        session_token
    FROM 
        usuarios
    WHERE 
        id = $1
    `;
    return db.oneOrNone(sql, id).then(user => { callback(null,user) });
}

module.exports = User;