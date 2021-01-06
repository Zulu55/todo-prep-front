import React from 'react'
import axios from 'axios'

export const TaskContext = React.createContext()

const api = axios.create({
    baseURL: 'https://taskprep.azurewebsites.net',
    headers: {
        // 'Accept': 'application/json',
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': '*', 
        // 'Access-Control-Allow-Methods': 'DELETE, PUT, POST, GET, OPTIONS',
        // 'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
    }
})

const TaskProvider = (props) => {

    const [tasks, setTasks] = React.useState([])

    const putTask = async(taskToUpdate) => {
        try {
            await api.put(`/api/todos/${taskToUpdate.rowKey}`, JSON.stringify(taskToUpdate))
            const editedTask = tasks.map(item => (
                item.rowKey === taskToUpdate.rowKey ? taskToUpdate : item
            ))
            setTasks(editedTask)
        } catch (error) {
            console.log(error)
        }
    }

   const deleteTask = async(rowKey) => {
        try {
            await api.delete(`/api/todos/${rowKey}`)
            const filterTask = tasks.filter(item => item.rowKey !== rowKey)
            setTasks(filterTask)
        } catch (error) {
            console.log(error)
        }
    }

    const postTask = async(newTask) => {
        try {
            const response = await api.post('/api/todos/', JSON.stringify(newTask))
            setTasks([...tasks, {
                'createdTime': response.data.createdTime,
                'taskDescription': response.data.taskDescription,
                'isCompleted': response.data.isCompleted,
                'rowKey': response.data.id
            }])
        } catch (error) {
            console.log(error)
        }
    }

    const getTasks = async() => {
        try {
            const response = await api.get('/api/todos/')
            const list = response.data.map(item => ({
                'createdTime': item.createdTime,
                'taskDescription': item.taskDescription,
                'isCompleted': item.isCompleted,
                'rowKey': item.id
            }))
            setTasks(list)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <TaskContext.Provider value={{tasks, getTasks, putTask, postTask, deleteTask}}>
            {props.children}
        </TaskContext.Provider>
    )
}

export default TaskProvider
