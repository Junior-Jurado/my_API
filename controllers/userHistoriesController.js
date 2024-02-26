const UserHystory = require('../models/user_history')
const Project = require('../models/project')


module.exports = {
    async create(req, res, next) {
        try {
            const data = req.body;
            existProject = await Project.search_project(data.project_id);


            if(existProject != null) {
                id_history = await UserHystory.create(data, existProject);
                const myData = {
                    user: data.user,
                    id: id_history,
                    desciption: data.desciption,
                    criteria: data.criteria,
                    state: data.state_id,
                    created_by: existProject.created_by_id,
                    project: existProject.id 
                }

                return res.status(201).json({
                    success: true,
                    message: 'El registro se realizo correctamente!!',
                    data: myData
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'No se puede crear la historia de Usuario, ya que el proyecto no existe!'
                });
            }
            
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al crear la historia de usuarios'
            });
        }
    }
}