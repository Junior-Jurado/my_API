const Task = require('../models/task');
const UserHistory = require('../models/user_history');
const User = require('../models/user');

/**
 * Controlador que gestiona las operaciones relacionadas con las tareas.
 */
module.exports = {
    /**
     * Crea una nueva tarea.
     * @param {Object} req - Objeto de solicitud HTTP que contiene los datos de la nueva tarea.
     * @param {Object} res - Objeto de respuesta HTTP.
     * @param {Function} next - Función para pasar el control al siguiente manejador de middleware.
     * @returns {Object} Respuesta HTTP con el resultado de la creación de la tarea.
     */
    async create(req, res, next) {
        try {
            const data = req.body;

            existHistory = await UserHistory.search(data.user_history_id);

            if (existHistory != null) {
                idTask = await Task.create(data, existHistory);
                const myData = {
                    id: idTask,
                    name: data.name,
                    desciption: data.desciption,
                    user_history_id: existHistory.id,
                    created_by: data.user
                };

                return res.status(201).json({
                    success: true,
                    message: 'La tarea se ha creado correctamente!',
                    data: myData
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'No se puede crear la tarea, ya que la historia de usuario no existe!'
                });
            }

        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al crear la tarea'
            });
        }
    },

    /**
     * Asigna una tarea a un usuario.
     * @param {Object} req - Objeto de solicitud HTTP que contiene los datos de la tarea y del usuario a asignar.
     * @param {Object} res - Objeto de respuesta HTTP.
     * @param {Function} next - Función para pasar el control al siguiente manejador de middleware.
     * @returns {Object} Respuesta HTTP con el resultado de la asignación de la tarea.
     */
    async assignment(req, res, next) {
        try {
            const data = req.body;
            manager = await Task.searchManager(data.task, data.user);

            if (manager != null) {
                userTask = await Task.searchUserTask(data.task, data.user);
                if (userTask == null) {
                    assigment = await Task.assignment(data.task, data.dev);
                    return res.status(201).json({
                        success: true,
                        message: 'La tarea se ha asignado correctamente!',
                        data: assigment
                    });

                } else {
                    return res.status(401).json({
                        success: false,
                        message: 'El desarrollador ya está en el proyecto'
                    });
                }
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'No se puede añadir desarrolladores al proyecto, ya que no eres el gerente de este proyecto!'
                });
            }

        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al asignar tarea al usuario!',
                error: error
            });
        }
    },

    /**
     * Actualiza una tarea existente.
     * @param {Object} req - Objeto de solicitud HTTP que contiene los datos actualizados de la tarea.
     * @param {Object} res - Objeto de respuesta HTTP.
     * @param {Function} next - Función para pasar el control al siguiente manejador de middleware.
     * @returns {Object} Respuesta HTTP con el resultado de la actualización de la tarea.
     */
    async update(req, res, next) {
        try {
            const data = req.body;

            task = await Task.search(data.id);

            if (task != null) {
                if (data.state != task.state_id) {
                    await Task.updateState(task.id, data.user);
                }
                await Task.update(data);

                return res.status(201).json({
                    success: true,
                    message: 'La tarea se ha actualizado correctamente!'
                });

            } else {
                return res.status(401).json({
                    success: false,
                    message: 'No se puede actualizar la tarea, ya que la tarea no existe!'
                });
            }

        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al actualizar la tarea'
            });
        }
    },

    /**
     * Elimina una tarea.
     * @param {Object} req - Objeto de solicitud HTTP que contiene los datos de la tarea a eliminar.
     * @param {Object} res - Objeto de respuesta HTTP.
     * @param {Function} next - Función para pasar el control al siguiente manejador de middleware.
     * @returns {Object} Respuesta HTTP con el resultado de la eliminación de la tarea.
     */
    async delete(req, res, next) {
        try {
            const data = req.body;
            user = await Task.searchUserTask(data.task, data.user);
            manager = await Task.searchManager(data.task, data.user);

            if (user != null || manager != null) {
                await Task.deleteAssignments(data.task);
                await Task.delete(data.task);
                return res.status(201).json({
                    success: true,
                    message: 'La tarea se ha eliminado correctamente!'
                });

            } else {
                return res.status(401).json({
                    success: false,
                    message: 'La tarea o el usuario no existen!'
                });
            }
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al eliminar la tarea'
            });
        }
    },

    /**
     * Actualiza el estado de una tarea.
     * @param {Object} req - Objeto de solicitud HTTP que contiene los datos de la tarea y el nuevo estado.
     * @param {Object} res - Objeto de respuesta HTTP.
     * @param {Function} next - Función para pasar el control al siguiente manejador de middleware.
     * @returns {Object} Respuesta HTTP con el resultado de la actualización del estado de la tarea.
     */
    async updateState(req, res, next) {
        try {
            const data = req.body;

            const task = await Task.search(data.task);
            const user = await Task.searchUserTask(data.task, data.user);
            const manager = await Task.searchManager(data.task, data.user);

            if (user != null || manager != null) {
                if (data.state >= 1 && data.state <= 3) {
                    if (task.state_id != data.state) {
                        taskUpd = await Task.updateState(data.task, data.user);

                        await Task.updateTask(taskUpd['task_id'], data.state);
                        return res.status(201).json({
                            success: true,
                            message: 'El estado de la tarea se actualizó correctamente!'
                        });
                    } else {
                        return res.status(201).json({
                            success: true,
                            message: 'La tarea no se puede actualizar al estado que tiene actualmente, debe ser distinto!'
                        });
                    }
                } else {
                    return res.status(401).json({
                        success: false,
                        message: 'Error estado inválido: El estado al que quieres cambiar no existe!'
                    });
                }
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'La tarea o el usuario no existen!'
                });
            }

        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al registrar el cambio de estado de la tarea'
            });
        }
    }
};
