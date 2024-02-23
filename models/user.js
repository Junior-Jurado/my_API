const db = require('../config/config');
const bcrypt = require('bcryptjs')


const User = {};

User.getAll = () =>{
    const sql = `
    SELECT 
        *
    FROM 
        users
    `;

    return db.manyOrNone(sql);
}

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