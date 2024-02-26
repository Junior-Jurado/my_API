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

module.exports = UserHistory;