const db = require('../config/config');

const UserHistory = {};

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

UserHistory.search = async (id) => {
    const sql = `
        SELECT * 
        FROM user_histories
        WHERE id = $1
    `;
    return db.oneOrNone(sql, id);
}

UserHistory.update = async (UserHistory, state) => {
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
        state
    ]);
}

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

UserHistory.delete = async (id) => {
    const sql = `
        DELETE 
        FROM user_histories 
        WHERE id = $1 
    `;
    return db.none(sql, id);
}

UserHistory.deleteChangeTracking = (id) => {
    const sql = `
        DELETE 
        FROM change_tracking_history 
        WHERE user_histoy_id = $1 
    `;
    return db.none(sql, id);
}


module.exports = UserHistory;