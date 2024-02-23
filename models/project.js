const db = require('../config/config')

const Project = {};

/*Project.create = async (project) => {
    const sql = `
    INSERT INTO
        projects(
            name,
            description,
            start_date,
            state_id,
            created_by_id
        )
    VALUES($1, $2, $3, $4, $5) RETURNING id
    `;
    return db.oneOrNone(sql, [
        project.name,
        project.description,
        new Date(),
        1,
        project.create_by_id
    ]);
}*/

module.exports = Project;