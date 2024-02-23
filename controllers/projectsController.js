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
    }
}