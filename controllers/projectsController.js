const Project = require('../models/project');
const User = require('../models/user');

/**
 * Controlador que gestiona las operaciones relacionadas con los proyectos.
 */
module.exports = {
    /**
     * Crea un nuevo proyecto.
     * @param {Object} req - Objeto de solicitud HTTP que contiene los datos del nuevo proyecto.
     * @param {Object} res - Objeto de respuesta HTTP.
     * @param {Function} next - Función para pasar el control al siguiente manejador de middleware.
     * @returns {Object} Respuesta HTTP con el resultado de la creación del proyecto.
     */
    async create(req, res, next) {
        try {
            const project = req.body;
            const id = project.created_by_id;
            const user = await User.findByIdPerRol(id);

            if (user['rol'] == 1) {
                console.log('Project', project);

                const data = await Project.create(project);

                return res.status(201).json({
                    success: true,
                    message: 'El proyecto ha sido creado correctamente!',
                    data: {
                        'id': data.id
                    }
                });

            } else {
                return res.status(401).json({
                    success: true,
                    message: 'No eres gerente, no puedes crear un proyecto!'
                });
            }

        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al crear el proyecto',
                error: error
            });
        }
    },

    /**
     * Añade un desarrollador a un proyecto existente.
     * @param {Object} req - Objeto de solicitud HTTP que contiene los datos para añadir el desarrollador.
     * @param {Object} res - Objeto de respuesta HTTP.
     * @param {Function} next - Función para pasar el control al siguiente manejador de middleware.
     * @returns {Object} Respuesta HTTP con el resultado de la operación.
     */
    async addDeveloper(req, res, next) {
        try {
            const data = req.body;
            const project = await Project.search_project(data.project_id);
            const user = await User.findByIdPerRol(data.user_id);

            if (!project) {
                return res.status(401).json({
                    success: false,
                    message: 'Error: el proyecto no existe!'
                });
            } else if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Error: el desarrollador no existe!'
                });
            } else if (user['rol'] == 1) {
                return res.status(401).json({
                    success: false,
                    message: 'No puedes añadir otro gerente al proyecto!'
                });
            } else {
                const exists = await Project.search_assignment(user['id'], project['id']);

                if (exists != null) {
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
                message: 'Error al añadir el desarrollador al proyecto',
                error: error
            });
        }
    },

    /**
     * Elimina un desarrollador de un proyecto.
     * @param {Object} req - Objeto de solicitud HTTP que contiene los datos para eliminar el desarrollador.
     * @param {Object} res - Objeto de respuesta HTTP.
     * @param {Function} next - Función para pasar el control al siguiente manejador de middleware.
     * @returns {Object} Respuesta HTTP con el resultado de la operación.
     */
    async deleteDeveloper(req, res, next) {
        try {
            const data = req.body;
            const exists = await Project.search_assignment(data.user_id, data.project_id);

            if (exists != null) {
                await Project.deleteDeveloper(data.user_id, data.project_id);
                return res.status(201).json({
                    success: true,
                    message: 'El desarrollador se ha eliminado del proyecto!'
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
                message: 'Error al eliminar el desarrollador del proyecto',
                error: error
            });
        }
    },

    /**
     * Obtiene los proyectos asociados a un usuario.
     * @param {Object} req - Objeto de solicitud HTTP que contiene el ID del usuario.
     * @param {Object} res - Objeto de respuesta HTTP.
     * @param {Function} next - Función para pasar el control al siguiente manejador de middleware.
     * @returns {Object} Respuesta HTTP con los proyectos asociados al usuario.
     */
    async viewProjects(req, res, next) {
        try {
            const id = req.params.id;
            const myProjectsG = await Project.view_project_gerente(id);

            if (myProjectsG.length != 0) {
                return res.status(201).json({
                    success: true,
                    message: 'Vista de proyectos abierta!',
                    projects: myProjectsG
                });
            }

            const myProjectsD = await Project.view_project_developer(id);

            if (myProjectsD.length != 0) {
                return res.status(201).json({
                    success: true,
                    message: 'Vista de proyectos abierta!',
                    projects: myProjectsD
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'El usuario no tiene proyectos!'
                });
            }

        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los proyectos del usuario',
                error: error
            });
        }
    }
}
