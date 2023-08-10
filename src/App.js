import React,{useEffect, useState} from 'react';
import './App.css';
import {AiOutlineDelete} from 'react-icons/ai';
import {BsCheckLg} from 'react-icons/bs';
import {BiEdit} from 'react-icons/bi';


function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [name, setName] = useState('');

  const formatTimeLeft = (timeLeftInSeconds) => {
    const days = Math.floor(timeLeftInSeconds / 86400);
    const hours = Math.floor((timeLeftInSeconds % 86400) / 3600);
    const minutes = Math.floor((timeLeftInSeconds % 3600) / 60);
    const seconds = timeLeftInSeconds % 60;
  
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };
  

  const handleAddTodo = () => {
    
    let newTodoItem = {
      title: newTitle,
      description: newDescription,
      deadline: newDeadline,
    };

    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push(newTodoItem);
    setTodos(updatedTodoArr);
    localStorage.setItem(`todolist`, JSON.stringify(updatedTodoArr));
    setNewTitle(""); 
    setNewDescription(""); 
    setNewDeadline("");
  };

  const handleDeleteTodo = (index) =>{
    let reducedTodo = [...allTodos];
    reducedTodo.splice(index, 1);
    localStorage.setItem(`todolist`, JSON.stringify(reducedTodo));
    setTodos(reducedTodo);
  }

  const handleComplete = (index) =>{
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let completedOn = dd + '-' + mm + '-' + yyyy + ' at ' + h + ':' + m + ':' + s;
    let filteredItem = {
      ...allTodos[index],
      completedOn: completedOn
    }
   

    let updatedCompletedArr = [...completedTodos];
    updatedCompletedArr.push(filteredItem);
    setCompletedTodos(updatedCompletedArr);
    handleDeleteTodo(index);
    localStorage.setItem(`completedTodos`, JSON.stringify(updatedCompletedArr));
  };

  const handleDeleteCompletedTodo = (index) =>{
    let reducedTodo = [...completedTodos];
    reducedTodo.splice(index,1);
    localStorage.setItem(`completedTodos`, JSON.stringify(reducedTodo));
    setCompletedTodos(reducedTodo);
  };


  const handleEdit = (index) => {
  const todoToEdit = allTodos[index];
  setEditIndex(index);
  setEditTitle(todoToEdit.title);
  setEditDescription(todoToEdit.description);
  setEditDeadline(todoToEdit.deadline || "");
};

const handleUpdateTodo = () => {
  if (editIndex !== -1) {
    let updatedTodoArr = [...allTodos];
      updatedTodoArr[editIndex] = {
      title: editTitle,
      description: editDescription,
      deadline: editDeadline,
    };
    console.log(editDeadline);
    setTodos(updatedTodoArr);
    localStorage.setItem("todolist", JSON.stringify(updatedTodoArr));

    // Clear edit state variables after update
    setEditIndex(-1);
    setEditTitle("");
    setEditDescription("");
    setEditDeadline("");
  }
};


  useEffect(() =>{
    let savedTodo = JSON.parse(localStorage.getItem(`todolist`));
    let savedCompletedTodo = JSON.parse(localStorage.getItem(`completedTodos`));
    if(savedTodo){
      setTodos(savedTodo);
    }

    if(savedCompletedTodo){
      setCompletedTodos(savedCompletedTodo);
    }
    
  }, []);




  useEffect(() => {
    const now = new Date().getTime();
    const oneSecond = 1000;
  
    const updatedTimeLeft = allTodos.map((item) => {
      if (item.deadline) {
        const deadlineTime = new Date(item.deadline).getTime();
        const timeDiff = Math.max(deadlineTime - now, 0);
        const timeLeftInSeconds = Math.floor(timeDiff / oneSecond);
        return { ...item, timeLeftInSeconds };
      } else {
        return { ...item, timeLeftInSeconds: 0 };
      }
    });
  
    setTodos(updatedTimeLeft);
  }, [newDeadline]);

  const handleInputChange = (value) => {
    setName(value);
    localStorage.setItem('username', value);
  };
  
  useEffect(() => {
    const savedName = localStorage.getItem('username') || '';
    setName(savedName);
  }, []);


 
  return (
    <div className="App">
      <div className='greeting'>
      <h1 className='title'> What's up, <input type = 'text' value={name} onChange = {(e) => handleInputChange(e.target.value)} placeholder = "Name Here"/> </h1>
      </div>
      <div className='todo-wrapper'>
        <div className='todo-input'>
          <div className = 'todo-input-item'>
            <label> Title </label>
            <input type ="text" value ={newTitle} onChange = {(e) => setNewTitle(e.target.value)} placeholder ="What's the task title?"></input>
          </div>
          <div className='todo-input-item'>
            <label> Description</label>
            <input type = "text" value ={newDescription} onChange = {(e) => setNewDescription(e.target.value)} placeholder = "What's the task description?" />
          </div>
          <div className='todo-input-item'>
            <label> Deadline</label>
            <input type = "text" id='timeleft' value ={newDeadline} onChange = {(e) => setNewDeadline(e.target.value)} placeholder = "What's the deadline?" />
          </div>

          <div className='todo-input-item'>
            <button typr ='button' onClick = {handleAddTodo} className ='primaryBtn'> Add </button>
          </div>
        </div>

        <div className = "btn-area">
          <button className={`secondaryBtn ${isCompleteScreen === false && 'active'}`} onClick={() => setIsCompleteScreen(false) }> Todo </button>
          <button className={`secondaryBtn ${isCompleteScreen === true && 'active'}`} onClick={() => setIsCompleteScreen(true) }> Completed </button>
        </div>
        <div className="todo-list">

          {isCompleteScreen === false && allTodos.map((item, index) => {
            return(
              <div className ="todo-list-item" key = {index}>
        
                {editIndex === index ? (
                  <>
                  <div className="edit-todo-item">
                    <input type='text' value ={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                    <input type='text' value ={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                    <input type='text' value ={editDeadline} onChange={(e) => setEditDeadline(e.target.value)} />
                  </div>
                  <div>
                  <button className= "editBtn"onClick={() => handleUpdateTodo()}>Save</button>
                  <button className = "cancelBtn" onClick={() => setEditIndex(-1)}>Cancel</button>
                  </div>
                  </>
                ) : (
                  < >
                  <div>
                  <h3> {item.title} </h3>
                  <p> {item.description} </p>
                  {item.deadline && (
                    <p> <small> Time Left: {formatTimeLeft(item.timeLeftInSeconds)}</small></p>
                  )}
               
                  
                  </div>
            
            <div>
              <BiEdit className="edit-icon" onClick={() => handleEdit(index)} title = "Edit?" />
              <AiOutlineDelete className="icon" onClick={() => handleDeleteTodo(index)} title = "Delete?" />
              <BsCheckLg className="check-icon" onClick={() => handleComplete(index)} title = "Complete?" />
        
              </div>
              </>

                )}
            </div> 

            );
                  
               
          })}

            {isCompleteScreen === true && completedTodos.map((item, index) => {
            return(
              <div className ="todo-list-item" key = {index}>
            <div>
            <h3> {item.title} </h3>
            <p> {item.description} </p>
            <p> <small> Completed On : {item.completedOn}</small></p>
            </div>
            
            <div>
              <AiOutlineDelete className="icon" onClick={() => handleDeleteCompletedTodo(index)} title = "Delete?" />
              
            </div>
            </div> 

            )
          })}
          
           
            </div>
      </div>
    </div>
  );
}

export default App;
