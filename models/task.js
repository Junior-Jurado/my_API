const db = require('../config/config')

const Task = {};

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

Task.delete = (task) => {
    const sql = `
        DELETE 
        FROM tasks 
        WHERE id = $1 
    `;
    return db.none(sql, task);
}

Task.deleteAssignments = (task) => {
    const sql = `
        DELETE 
        FROM task_assignment 
        WHERE task_id = $1 
    `;
    return db.none(sql, task);
}

Task.deleteChangeTracking = (task) => {
    const sql = `
        DELETE 
        FROM change_tracking_task 
        WHERE task_id = $1 
    `;
    return db.none(sql, task);
}



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