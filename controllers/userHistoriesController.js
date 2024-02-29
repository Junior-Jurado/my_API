const UserHistory = require('../models/user_history');
const Project = require('../models/project');
const Task = require('../models/task');


module.exports = {
    /**
     * Crea una nueva historia de usuario.
     * @param {Object} req - Objeto de solicitud HTTP que contiene los datos de la historia de usuario a crear.
     * @param {Object} res - Objeto de respuesta HTTP.
     * @param {Function} next - Función para pasar el control al siguiente manejador de middleware.
     * @returns {Object} Respuesta HTTP con el resultado de la creación de la historia de usuario.
     */
    async create(req, res, next) {
        try {
            const data = req.body;
            existProject = await Project.search_project(data.project_id);

            if (existProject != null) {
                id_history = await UserHistory.create(data, existProject);
                const myData = {
                    user: data.user,
                    id: id_history,
                    desciption: data.desciption,
                    criteria: data.criteria,
                    state: data.state_id,
                    created_by: existProject.created_by_id,
                    project: existProject.id 
                };

                return res.status(201).json({
                    success: true,
                    message: 'El registro se realizó correctamente!!',
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
    },

    /**
     * Actualiza una historia de usuario existente.
     * @param {Object} req - Objeto de solicitud HTTP que contiene los datos de la historia de usuario a actualizar.
     * @param {Object} res - Objeto de respuesta HTTP.
     * @param {Function} next - Función para pasar el control al siguiente manejador de middleware.
     * @returns {Object} Respuesta HTTP con el resultado de la actualización de la historia de usuario.
     */
    async update(req, res, next) {
        try {
            const data = req.body;
            const task = Task.notFinalized(data.id);
            const user = data.user;
            const user_history = await UserHistory.search(data.id);

            if (user == user_history.created_by_id) {
                if (data.state_id != user_history.state_id) {
                    if (data.state_id == 3 && task == null && user_history != null) {
                        await UserHistory.update(user_history, data.state_id);
                        id = await UserHistory.updateState(user_history.id, user_history.created_by);
                        return res.status(201).json({
                            success: true,
                            message: 'La historia de usuario se actualizó correctamente!!',
                            data: id
                        });
                    } else if (user_history != null && data.state_id != 3) {
                        await UserHistory.update(user_history, data.state_id);
                        id = await UserHistory.updateState(user_history.id, user_history.created_by_id);
                        return res.status(201).json({
                            success: true,
                            message: 'La historia de usuario se actualizó correctamente!!',
                            data: id
                        });
                    } else if (data.state_id == 3 && task != null) {
                        return res.status(401).json({
                            success: false,
                            message: 'No se puede finalizar la historia de usuario, ya que tiene tareas pendientes por terminar!!'
                        });
                    } else {
                        return res.status(401).json({
                            success: false,
                            message: 'No se puede actualizar la historia de Usuario.'
                        });
                    }
                } else {
                    return res.status(401).json({
                        success: false,
                        message: 'No se puede actualizar el estado de la historia de usuario al estado que tiene actualmente, debe ser distinto!'
                    });
                }
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'No eres gerente del proyecto no se puede actualizar la historia de usuario'
                });
            }
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al actualizar la historia de usuario'
            });
        }
    },

    /**
     * Elimina una historia de usuario existente.
     * @param {Object} req - Objeto de solicitud HTTP que contiene los datos de la historia de usuario a eliminar.
     * @param {Object} res - Objeto de respuesta HTTP.
     * @param {Function} next - Función para pasar el control al siguiente manejador de middleware.
     * @returns {Object} Respuesta HTTP con el resultado de la eliminación de la historia de usuario.
     */
    async delete(req, res, next) {
        try {
            const data = req.body;
            const user = data.user;
            const user_history = await UserHistory.search(data.id);
            const taskHistory = await Task.searchHistory(data.id);

            if (user_history == null) {
                return res.status(401).json({
                    success: false,
                    message: 'La historia de usuario no existe!!'
                });
            }

            if (user_history.created_by_id == user) {
                for (const task of taskHistory) {
                    await Task.deleteChangeTracking(task.id)
                    await Task.deleteAssignments(task.id)
                    await Task.delete(task.id);                    
                }
                await UserHistory.deleteChangeTracking(data.id)
                await UserHistory.delete(data.id)

                return res.status(201).json({
                    success: true,
                    message: 'La historia de usuario se eliminó correctamente!!'
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'No eres gerente de este proyecto para eliminar la historia de usuario'
                });
            }
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al eliminar la historia de usuario'
            });
        }
    }
};
