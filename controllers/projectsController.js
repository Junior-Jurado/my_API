const Project = require('../models/project')
const User = require('../models/user')

module.exports = {
    async create(req, res, next) {
        try {
            const project = req.body;
            const id = project.create_by_id
            const user = await User.findByIdPerRol(id)            
            

            if (user['rol'] == 1) {
                console.log('Project', project);

                const data = await Project.create(project);

                return res.status(201).json({
                    success: true,
                    message: 'El projecto ha sido creado correctamente!',
                    data: {
                        'id': data.id
                    }
                });
                  
            } else{
                return res.status(401).json({
                    success: true,
                    message: 'No eres gerente, no puedes crear un proyecto!',
                });
            }
            
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al crear el projecto',
                error: error
            });
        }
    },

    async addDeveloper(req, res, next) {
        try {
            const data = req.body;
            const project = await Project.search_project(data.project_id)
            const user = await User.findByIdPerRol(data.user_id)
            
            if (!project) {
                return res.status(401).json({
                    success: false,
                    message: 'Error el projecto no existe!'
                });
            } else if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'El desarrollador no existe!'
                });
            } else {
                const existe = await Project.search_assignment(user['id'], project['id']);
                console.log(existe)
                if (existe != null) {
                    return res.status(401).json({
                        success: false,
                        message: 'El desarrollador ya pertenece al proyecto'
                    });
                } else {
                    await Project.addDeveloper(project['id'], user['id']);
                    return res.status(201).json({
                    success: true,
                    message: 'El desarrollador se ha asignado correctamente al proyecto!'
                    });
                }
                
            }
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al crear el projecto',
                error: error
            });
        }
    },
    
    async deleteDeveloper(req, res, next) {
        try {
            const data = req.body;
            const existe = await Project.search_assignment(data.user_id, data.project_id)
            console.log(existe)
            if (existe != null) {
                await Project.deleteDeveloper(data.user_id, data.project_id);
                return res.status(201).json({
                    success: true,
                    message: 'El desarrollador se ha eliminado proyecto!'
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'El desarrollador no pertenece al proyecto'
                });
            }
            
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al crear el projecto',
                error: error
            });
        }
    }
}