const Task = require('../models/task')
const UserHystory = require('../models/user_history')
const User = require('../models/user');
const { task } = require('../config/config');

module.exports = {
    async create(req, res, next) {
        try {
            const data = req.body;

            existHistory = await UserHystory.search(data.user_history_id)

            console.log(existHistory)
            
            if (existHistory != null) {
                idTask = await Task.create(data, existHistory);
                const myData = {
                    id: idTask,
                    name: data.name,
                    desciption: data.desciption,
                    user_history_id: existHistory.id,
                    created_by: data.user
                }

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

    async assignment(req, res, next) {
        try {
            const data = req.body;
            manager = await Task.searchManager(data.task, data.user);


            if (manager != null) {
                userTask = await Task.searchUserTask(data.task, data.user);
                if (userTask == null) {
                    assigment = await Task.assignment(data.task, data.dev)
                    return res.status(201).json({
                        success: true,
                        message: 'La tarea se ha assignado correctamente!',
                        data: assigment
                    });

                } else {
                    return res.status(401).json({
                        success: false,
                        message: 'El desarrollador ya esta en el proyecto'
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

    async update(req, res, next) {
        try {
            const data = req.body;

            task = await Task.search(data.id);

            if(task != null) {
                if(data.state != task.state_id){
                    await Task.updateState(task.id, data.user)
                }
                await Task.update(data);
                

                return res.status(201).json({
                    success: true,
                    message: 'La tarea se ha actualizado correctamente!'
                });

            } else {
                return res.status(401).json({
                    success: false,
                    message: 'No se puede actulizar la tarea, ya que la tarea no existe!'
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

    async delete(req, res, next) {
        try {
            const data = req.body;
            user = await Task.searchUserTask(data.task, data.user);
            manager = await Task.searchManager(data.task, data.user);

            if (user != null || manager != null) {
                await Task.deleteAssignments(data.task)
                await Task.delete(data.task)
                return res.status(201).json({
                    success: true,
                    message: 'La tarea se ha eliminado correctamente!'
                });

            } else {
                return res.status(401).json({
                    success: false,
                    message: 'La tarea o el usuario, NO existen!'
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

    async updateState(req, res, next) {
        try {
            const data = req.body;

            const task = await Task.search(data.task)
            const user = await Task.searchUserTask(data.task, data.user);
            const manager = await Task.searchManager(data.task, data.user);

            if (user != null || manager != null) {
                if (data.state>=1 && data.state<=3) {
                    if (task.state_id != data.state) {
                        taskUpd = await Task.updateState(data.task, data.user)
                        
                        await Task.updateTask(taskUpd['task_id'], data.state)
                        return res.status(201).json({
                            success: true,
                            message: 'El estado de la tarea se actualizo correctamente!'
                        });
                    } else {
                        return res.status(201).json({
                            success: true,
                            message: 'La tarea no se puede actualizar al estado que tiene actualmente, debe ser distinto!!'
                        });
                    }
                    
    
                } else {
                    return res.status(401).json({
                        success: false,
                        message: 'Error estado invalido: El estado al que quieres cambiar no existe!!'
                    });
                }
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'La tarea o el usuario, NO existen!'
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
}
