import React from 'react'
import moment from 'moment'
import Alert from './Alert'
import {TaskContext} from '../context/TaskProvider'

const Tasks = () => {

    const {tasks, getTasks, putTask, postTask, deleteTask} = React.useContext(TaskContext) 
    const [task, setTask] = React.useState('')
    const [editMode, setEditMode] = React.useState(false)
    const [taskEdit, setTaskEdit] = React.useState(null)
    const [isLoading, setIsLoading] = React.useState(true)
    const [error, setError] = React.useState(null)

    React.useEffect(() => {
        getTasks()
        setIsLoading(false)
    }, [])

    const addTask = e => {
        e.preventDefault()
        if(!task.trim()) {
            setError('You must enter a task description.')
            return
        }

        postTask({ 'taskDescription': task })
        setTask('')
        setError(null)
    }

    const saveTask = e => {
        e.preventDefault()
        if(!task.trim()) {
            setError('You must enter a task description.')
            return
        }

        const toUpdate = {
            'createdTime': taskEdit.createdTime,
            'taskDescription': task,
            'isCompleted': true,
            'rowKey': taskEdit.rowKey
        }

        putTask(toUpdate)
        setTask('')
        setTaskEdit(null)
        setEditMode(false)
        setError(null)
    }

    const activateEditMode = (item) => {
        setEditMode(true)
        setTask(item.taskDescription)
        setTaskEdit(item)
    }

    return (
        <div className="row">
            <div className="col-lg-8">
            <h3>Tasks List</h3>
                {
                    isLoading ? (
                        <Alert message={error}/>
                    ) : (
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Date</th>
                                    <th>Completed</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    tasks.map(item => (
                                        <tr key={item.rowKey}>
                                            <td>{item.taskDescription}</td>
                                            <td>{moment(item.createdTime).format('YYYY/MM/DD hh:ss')}</td>
                                            <td>
                                                {
                                                    item.checked ? (
                                                        <input type="checkbox" disabled checked/>
                                                    ) : (
                                                        <input type="checkbox" disabled/>
                                                    )
                                                }
                                            </td>
                                            <td>
                                                <button 
                                                    className="btn btn-warning mr-2"
                                                    onClick={() => activateEditMode(item)}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="btn btn-danger"
                                                    onClick={() => deleteTask(item.rowKey)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    )
            }
            </div>
            <div className="col-lg-4">
                <h3>{editMode ? 'Edit Task' : 'New Task'}</h3>
                <form onSubmit={editMode ? saveTask : addTask}>
                    <input 
                        type="text" 
                        className="form-control mb-2 mt-3"
                        placeholder="Enter the new task description..."
                        value={task}
                        onChange={e => setTask(e.target.value)}
                    />
                    <label className="form-control">
                    Complete?
                    </label>
                    <input 
                        type="checkbox" 
                        className="form-control mb-2 mt-3"
                    />
                    {
                        error && (
                            <Alert message={error}/>
                        )
                    }
                    <button 
                        type="submit"
                        className={editMode ? 'btn btn-warning btn-block' : 'btn btn-dark btn-block'}
                    >
                        { editMode ? 'Save' : 'Add'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Tasks