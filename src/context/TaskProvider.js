import React from 'react'
import axios from 'axios'

export const TaskContext = React.createContext()

const api = axios.create({
    baseURL: 'https://todoapiprep.azurewebsites.net',
    // headers: {
    //     'Access-Control-Allow-Origin': '*'
    // }
})

const TaskProvider = (props) => {

    const [tasks, setTasks] = React.useState([])

    const putTask = async(taskToUpdate) => {
        try {
            await api.put(`/api/todo/${taskToUpdate.rowKey}`, JSON.stringify(taskToUpdate))
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
            await api.delete(`/api/todo/${rowKey}`)
            const filterTask = tasks.filter(item => item.rowKey !== rowKey)
            setTasks(filterTask)
        } catch (error) {
            console.log(error)
        }
    }

    const postTask = async(newTask) => {
        try {
            const response = await api.post('/api/todo/', JSON.stringify(newTask))
            setTasks([{
                'createdTime': response.data.result.createdTime,
                'taskDescription': response.data.result.taskDescription,
                'isCompleted': response.data.result.isCompleted,
                'rowKey': response.data.result.rowKey
            }, ...tasks])
        } catch (error) {
            console.log(error)
        }
    }

    const getTasks = async() => {
        try {
            const response = await api.get('/api/todo/')
            const list = response.data.result.map(item => ({
                'createdTime': item.createdTime,
                'taskDescription': item.taskDescription,
                'isCompleted': item.isCompleted,
                'rowKey': item.rowKey
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
