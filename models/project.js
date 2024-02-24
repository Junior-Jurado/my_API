const db = require('../config/config');

const Project = {};

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
        project.create_by_id,
        project.start_date,
        1
    ]);
}

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

Project.search_project = (id) => {
    const sql = `
        SELECT *
        FROM projects
        WHERE id = $1
    `;
    return db.oneOrNone(sql, id);
}

Project.deleteDeveloper = (user_id, project_id) => {
    const sql = `
        DELETE 
        FROM project_assigment 
        WHERE user_id = $1 AND project_id = $2
    `;
    return db.none(sql, [user_id, project_id]);
}

Project.search_assignment = (user_id, project_id) => {
    const sql = `
        SELECT * 
        FROM project_assigment
        WHERE user_id = $1 AND project_id = $2
    `;
    return db.oneOrNone(sql, [user_id, project_id]);
}
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