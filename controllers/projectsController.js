const Project = require('../models/project')


module.exports = {
    async create(req, res, next) {
        try {
            const project = req.body;
            console.log('Project', project);

            const data = await Project.create(project);

            if (data != null) {
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