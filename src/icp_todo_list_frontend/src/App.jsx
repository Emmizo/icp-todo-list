import { Actor, HttpAgent } from '@dfinity/agent';
import React, { useEffect, useState } from 'react';
import './App.css'; // Import the stylesheet
import { idlFactory as todoIdlFactory } from './todo_idl'; // Import your Motoko canister interface (IDL)

const canisterId = "br5f7-7uaaa-aaaaa-qaaca-cai"; // Replace with your deployed canister ID
// const agent = new HttpAgent({ host: "/api" }); // Localhost for local development

const todoActor = Actor.createActor(todoIdlFactory, {
  // agent,
  canisterId,
});
const App = () => {
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [deadline, setDeadline] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  // Initialize agent and actor
  useEffect(() => {
    const agent = new HttpAgent({ host: "http://localhost:3000" }); // ICP's main host
    // You may need to disable certificate verification for local dev, especially in dev environments
// if (process.env.NODE_ENV === "development") {
//   agent.fetchRootKey(); // This will allow connections without strict SSL checks during local dev.
// }

    const todoActor = Actor.createActor(todoIdlFactory, {
      agent,
      canisterId,
    });

    // Fetch todos
    const fetchTodos = async () => {
      const todoList = await todoActor.getTodos();
      setTodos(todoList);
    };

    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault(); // Prevent the form from submitting the traditional way

    const agent = new HttpAgent({ host: "http://localhost:3000" });
    const todoActor = Actor.createActor(todoIdlFactory, {
      agent,
      canisterId,
    });

    // Add new Todo
    await todoActor.addTodo(description, priority, BigInt(new Date(deadline).getTime()) * 1_000_000n);
    const todoList = await todoActor.getTodos();
    setTodos(todoList);

    // Reset form fields and show alert
    setDescription('');
    setPriority('Low');
    setDeadline('');
    setShowAlert(true);

    // Hide alert after 3 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  return (
    <div className="app-container">
      <h1>Todo List</h1>
      
      {showAlert && <div className="alert success">Task added successfully!</div>}

      <form className="todo-form" onSubmit={addTodo}>
        <input 
          type="text" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Task description" 
          className="form-input"
          required
        />
        <select 
          value={priority} 
          onChange={(e) => setPriority(e.target.value)} 
          className="form-select"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input 
          type="date" 
          value={deadline} 
          onChange={(e) => setDeadline(e.target.value)} 
          className="form-input"
          required
        />
        <button type="submit" className="form-button">Add Task</button>
      </form>

      <div className="todo-list">
        {todos.map((todo, index) => (
          <div key={index} className={`todo-card ${todo.completed ? 'completed' : ''}`}>
            <h3>{todo.description}</h3>
            <p><strong>Priority:</strong> {todo.priority}</p>
            <p><strong>Deadline:</strong> {new Date(Number(todo.deadline / 1_000_000n)).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {todo.completed ? "Completed" : "Pending"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;