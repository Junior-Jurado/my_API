const db = require('../config/config');

const Project = {};

/**
 * Crea un nuevo proyecto en la base de datos.
 * @param {Object} project - Objeto que contiene los datos del proyecto a crear.
 * @returns {Promise} Promesa que se resuelve con el ID del proyecto creado.
 */
Project.create = (project) => {
    const sql = `
    INSERT INTO
        projects(
            name,
            description,
            created_by_id,
            start_date,
            state_id
        )
    VALUES($1, $2, $3, $4, $5) RETURNING id
    `;
    return db.oneOrNone(sql, [
        project.name,
        project.description,
        project.created_by_id,
        project.start_date,
        1
    ]);
}

/**
 * Añade un desarrollador a un proyecto en la base de datos.
 * @param {number} project_id - ID del proyecto al que se va a añadir el desarrollador.
 * @param {number} user_id - ID del usuario que se va a añadir como desarrollador.
 * @returns {Promise} Promesa que indica la finalización de la operación.
 */
Project.addDeveloper = async (project_id, user_id) => {
    const sql = `
    INSERT INTO
        project_assigment(
            project_id,
            user_id
        )
    VALUES($1, $2)
    `;
    return db.none(sql, [
        project_id,
        user_id
    ]);
}

/**
 * Busca un proyecto por su ID en la base de datos.
 * @param {number} id - ID del proyecto a buscar.
 * @returns {Promise} Promesa que se resuelve con los datos del proyecto encontrado, o null si no se encuentra.
 */
Project.search_project = (id) => {
    const sql = `
        SELECT *
        FROM projects
        WHERE id = $1
    `;
    return db.oneOrNone(sql, id);
}

/**
 * Elimina un desarrollador de un proyecto en la base de datos.
 * @param {number} user_id - ID del usuario que se va a eliminar como desarrollador.
 * @param {number} project_id - ID del proyecto del que se va a eliminar al desarrollador.
 * @returns {Promise} Promesa que indica la finalización de la operación.
 */
Project.deleteDeveloper = (user_id, project_id) => {
    const sql = `
        DELETE 
        FROM project_assigment 
        WHERE user_id = $1 AND project_id = $2
    `;
    return db.none(sql, [user_id, project_id]);
}

/**
 * Busca una asignación de proyecto por el ID del usuario y el ID del proyecto en la base de datos.
 * @param {number} user_id - ID del usuario de la asignación de proyecto a buscar.
 * @param {number} project_id - ID del proyecto de la asignación de proyecto a buscar.
 * @returns {Promise} Promesa que se resuelve con los datos de la asignación de proyecto encontrada, o null si no se encuentra.
 */
Project.search_assignment = (user_id, project_id) => {
    const sql = `
        SELECT * 
        FROM project_assigment
        WHERE user_id = $1 AND project_id = $2
    `;
    return db.oneOrNone(sql, [user_id, project_id]);
}

/**
 * Obtiene los proyectos en los que está asignado un desarrollador.
 * @param {number} user_id - ID del desarrollador.
 * @returns {Promise} Promesa que se resuelve con los nombres de los proyectos asignados al desarrollador.
 */
Project.view_project_developer = (user_id) => {
    const sql = `
        SELECT p.name
        FROM users u
        INNER JOIN project_assigment pa
        ON u.id = pa.user_id
        INNER JOIN projects p
        ON pa.project_id = p.id
        WHERE u.id = $1 
    `;
    return db.manyOrNone(sql, user_id);
}

/**
 * Obtiene los proyectos creados por un gerente.
 * @param {number} user_id - ID del gerente.
 * @returns {Promise} Promesa que se resuelve con los nombres de los proyectos creados por el gerente.
 */
Project.view_project_gerente = (user_id) => {
    const sql = `
        SELECT p.name
        FROM users u
        INNER JOIN projects p
        ON u.id = p.created_by_id
        WHERE u.id = $1; 
    `;
    return db.manyOrNone(sql, user_id);
}

module.exports = Project;
