import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'
import TaskProvider from './context/TaskProvider.js'

ReactDOM.render(
  <React.StrictMode>
    <TaskProvider>
      <App />
    </TaskProvider>
  </React.StrictMode>,
  document.getElementById('root')
)