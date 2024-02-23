const Project = require('../models/project')


module.exports = {
    async createProject(req, res, next) {
        try {
            const project = req.body;
            const create_by = req.body.create_by_id

            if (create_by == 1) {
                const data = await Project.create(project);

                return res.status(201).json({
                    success: true,
                    message: 'El projecto ha sido creado correctamente!',
                    data: data.id
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'No puedes crear projectos porque no eres gerente'
                })
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