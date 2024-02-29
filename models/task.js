const db = require('../config/config')

// Objeto Task que maneja las operaciones relacionadas con tareas en la base de datos
const Task = {};

/**
 * Crea una nueva tarea en la base de datos.
 * @param {Object} Task - Objeto que contiene los datos de la tarea a crear.
 * @param {Object} History - Objeto que contiene los datos de historial asociados a la tarea.
 * @returns {Promise} Promesa que se resuelve con el ID de la tarea creada.
 */
Task.create = async(Task, History) => {
    const sql = `
    INSERT INTO
        tasks(
            name,
            description,
            user_history_id,
            create_by_id,
            state_id
        )
    VALUES($1, $2, $3, $4, $5) RETURNING id
    `;

    return db.oneOrNone(sql, [
        Task.name,
        Task.description,
        History.id,
        History.created_by_id,
        1
    ]);
}

/**
 * Busca una tarea por su ID en la base de datos.
 * @param {number} id - ID de la tarea a buscar.
 * @returns {Promise} Promesa que se resuelve con los datos de la tarea encontrada, o null si no se encuentra.
 */
Task.search = async (id) => {
    const sql = `
        SELECT 
            * 
        FROM 
            tasks
        WHERE
            id = $1
    `;
    return db.oneOrNone(sql, id);
}

/**
 * Busca todas las tareas asociadas a un historial de usuario en la base de datos.
 * @param {number} id - ID del historial de usuario.
 * @returns {Promise} Promesa que se resuelve con un array de objetos que representan las tareas encontradas.
 */
Task.searchHistory = async (id) => {
    const sql = `
        SELECT 
            * 
        FROM 
            tasks
        WHERE
            user_history_id = $1
    `;
    return db.manyOrNone(sql, id);
}

/**
 * Actualiza una tarea en la base de datos.
 * @param {Object} Task - Objeto que contiene los datos de la tarea a actualizar.
 * @returns {Promise} Promesa que indica la finalización de la operación.
 */
Task.update = async(Task) => {
    const sql = `
        UPDATE tasks
        SET 
            name = $2,
            description = $3,
            state_id = $4
        WHERE
            id = $1
    `;
    return db.none(sql,[
        Task.id,
        Task.name,
        Task.description,
        Task.state
    ]);
}

/**
 * Busca una asignación de tarea por ID de tarea y ID de usuario en la base de datos.
 * @param {number} task - ID de la tarea.
 * @param {number} user - ID del usuario.
 * @returns {Promise} Promesa que se resuelve con los datos de la asignación de tarea encontrada, o null si no se encuentra.
 */
Task.searchUserTask = async (task, user) => {
    const sql = `
        SELECT 
            *
        FROM 
            task_assignment
        WHERE
            task_id = $1 AND user_id = $2
        `;
    return db.oneOrNone(sql, [task, user]);
}

/**
 * Busca el gerente de una tarea en la base de datos.
 * @param {number} task - ID de la tarea.
 * @param {number} user - ID del usuario (gerente).
 * @returns {Promise} Promesa que se resuelve con los datos del gerente de la tarea encontrada, o null si no se encuentra.
 */
Task.searchManager = async (task, user) => {
    const sql = `
        SELECT 
            *
        FROM 
            user_histories uh
        INNER JOIN
            tasks t
        ON uh.id = t.user_history_id
        WHERE 
            uh.created_by_id = $1 AND t.id = $2
    `;
    return db.oneOrNone(sql, [
        user,
        task
    ]);
}

/**
 * Elimina una tarea de la base de datos.
 * @param {number} task - ID de la tarea a eliminar.
 * @returns {Promise} Promesa que indica la finalización de la operación.
 */
Task.delete = (task) => {
    const sql = `
        DELETE 
        FROM tasks 
        WHERE id = $1 
    `;
    return db.none(sql, task);
}

/**
 * Elimina las asignaciones de tarea de la base de datos.
 * @param {number} task - ID de la tarea cuyas asignaciones se eliminarán.
 * @returns {Promise} Promesa que indica la finalización de la operación.
 */
Task.deleteAssignments = (task) => {
    const sql = `
        DELETE 
        FROM task_assignment 
        WHERE task_id = $1 
    `;
    return db.none(sql, task);
}

/**
 * Elimina el seguimiento de cambios de una tarea de la base de datos.
 * @param {number} task - ID de la tarea cuyo seguimiento de cambios se eliminará.
 * @returns {Promise} Promesa que indica la finalización de la operación.
 */
Task.deleteChangeTracking = (task) => {
    const sql = `
        DELETE 
        FROM change_tracking_task 
        WHERE task_id = $1 
    `;
    return db.none(sql, task);
}

/**
 * Asigna una tarea a un usuario en la base de datos.
 * @param {number} task - ID de la tarea a asignar.
 * @param {number} user - ID del usuario al que se asignará la tarea.
 * @returns {Promise} Promesa que se resuelve con el ID de la asignación de tarea creada.
 */
Task.assignment = async (task, user) => {
    const sql = `
        INSERT INTO
            task_assignment(
                task_id,
                user_id
            )
        VALUES($1, $2) RETURNING id
        `;
    return db.oneOrNone(sql, [task, user]);
}

/**
 * Actualiza el estado de una tarea en la base de datos.
 * @param {number} task - ID de la tarea cuyo estado se actualizará.
 * @param {number} user - ID del usuario que realiza el cambio de estado.
 * @returns {Promise} Promesa que se resuelve con el ID de la tarea cuyo estado se actualizó.
 */
Task.updateState = async(task, user) => {
    const sql=`
        INSERT INTO
            change_tracking_task(
                task_id,
                changed_by_id,
                change_date
            )
        VALUES ($1, $2, $3) RETURNING task_id
    `;
    return db.oneOrNone(sql, [
        task,
        user,
        new Date()
    ]);
}

/**
 * Actualiza el estado de una tarea en la base de datos.
 * @param {number} task_id - ID de la tarea cuyo estado se actualizará.
 * @param {number} state_id - ID del nuevo estado de la tarea.
 * @returns {Promise} Promesa que se resuelve con el ID de la tarea cuyo estado se actualizó.
 */
Task.updateTask = async(task_id, state_id) => {
    const sql=`
        UPDATE 
            tasks
        SET state_id = $2
        WHERE id = $1
    `;
    return db.oneOrNone(sql, [
        task_id,
        state_id
    ]);
}

/**
 * Busca tareas no finalizadas asociadas a un historial de usuario en la base de datos.
 * @param {number} user_history - ID del historial de usuario.
 * @returns {Promise} Promesa que se resuelve con un array de objetos que representan las tareas no finalizadas encontradas.
 */
Task.notFinalized = async(user_history) => {
    const sql = `
        SELECT 
            * 
        FROM 
            tasks
        WHERE 
            state_id <> 3 
            AND user_history_id = $1
    `;

    return db.manyOrNone(sql, user_history);
}

module.exports = Task;
