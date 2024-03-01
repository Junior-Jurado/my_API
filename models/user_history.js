const db = require('../config/config');

const UserHistory = {};

/**
 * Crea un nuevo historial de usuario en la base de datos.
 * @param {Object} UserHistory - Objeto que contiene los datos del historial de usuario a crear.
 * @param {Object} Project - Objeto que contiene los datos del proyecto asociado al historial de usuario.
 * @returns {Promise} Promesa que se resuelve con el ID del historial de usuario creado.
 */
UserHistory.create = async (UserHistory, Project) => {
    const sql = `
    INSERT INTO
        user_histories(
            description,
            criteria,
            created_by_id,
            project_id,
            state_id
        )
    VALUES($1, $2, $3, $4, $5) RETURNING id
    `;
    return db.oneOrNone(sql,[
        UserHistory.description,
        UserHistory.criteria,
        Project.created_by_id,
        Project.id,
        1
    ]);
}

/**
 * Busca un historial de usuario por su ID en la base de datos.
 * @param {number} id - ID del historial de usuario a buscar.
 * @returns {Promise} Promesa que se resuelve con los datos del historial de usuario encontrado, o null si no se encuentra.
 */
UserHistory.search = async (id) => {
    const sql = `
        SELECT * 
        FROM user_histories
        WHERE id = $1
    `;
    return db.oneOrNone(sql, id);
}

/**
 * Actualiza un historial de usuario en la base de datos.
 * @param {Object} UserHistory - Objeto que contiene los datos del historial de usuario a actualizar.
 * @param {number} state - Estado actualizado del historial de usuario.
 * @returns {Promise} Promesa que indica la finalización de la operación.
 */
UserHistory.update = async (UserHistory) => {
    const sql = `
        UPDATE
            user_histories
        SET 
            description = $2,
            criteria=$3,
            state_id = $4
        WHERE 
            id = $1
    `;

    return db.none(sql, [
        UserHistory.id,
        UserHistory.description,
        UserHistory.criteria,
        UserHistory.state_id
    ]);
}

/**
 * Actualiza el estado de un historial de usuario en la base de datos.
 * @param {number} id - ID del historial de usuario a actualizar.
 * @param {number} user - ID del usuario que realiza el cambio de estado.
 * @returns {Promise} Promesa que se resuelve con el ID del cambio de estado registrado.
 */
UserHistory.updateState = async (id, user) => {
    const sql = `
        INSERT INTO
            change_tracking_history(
                user_histoy_id,
                changed_by_id,
                change_date
            )
        VALUES ($1, $2, $3) RETURNING id
    `;

    return db.oneOrNone(sql, [
        id,
        user,
        new Date()
    ]);
}

/**
 * Elimina un historial de usuario de la base de datos.
 * @param {number} id - ID del historial de usuario a eliminar.
 * @returns {Promise} Promesa que indica la finalización de la operación.
 */
UserHistory.delete = async (id) => {
    const sql = `
        DELETE 
        FROM user_histories 
        WHERE id = $1 
    `;
    return db.none(sql, id);
}

/**
 * Elimina el seguimiento de cambios de un historial de usuario de la base de datos.
 * @param {number} id - ID del historial de usuario cuyo seguimiento de cambios se eliminará.
 * @returns {Promise} Promesa que indica la finalización de la operación.
 */
UserHistory.deleteChangeTracking = (id) => {
    const sql = `
        DELETE 
        FROM change_tracking_history 
        WHERE user_histoy_id = $1 
    `;
    return db.none(sql, id);
}

module.exports = UserHistory;
