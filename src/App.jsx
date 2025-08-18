import "./App.css";
import { useEffect, useState, useRef } from "react";
import Navbar from "./components/Navbar";
import { v4 as uuidv4 } from 'uuid' //used to generate unique ids
//icons
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";


function App() {

  const [todo, setTodo] = useState("") //input text for todo
  const [todos, setTodos] = useState([]) //holds all todos
  const [showFinished, setShowFinished] = useState(true)
  const inputRef = useRef(null)

  useEffect(()=>{ //render once and load all the todos
    let todoString = localStorage.getItem("todos")
    if(todoString){ //if not null then do this
      let todos = JSON.parse(localStorage.getItem("todos")) // name of the key-> "todos"
      setTodos(todos);
    }
  },[])

  
  //Using Local Storage so the todo list content will not disappear when page is reloaded.
  const saveToLS = () => {
    localStorage.setItem("todos", JSON.stringify(todos))
    // "todos" -> saves data with key "todos"
    // JSON.stringify(todos) -> since localStorage can only store strings, this converts the todos array of objects into a string before saving.
  }

  const toggleFinished = (e) => {
    setShowFinished(!showFinished)
  }

  //NOTE- event is by default sent as an argument in the methods inside onClick, but you have to mention it in method definition

  // NOTE:- if you pass another parameter then you have to pass event too manually in the function
  const handleEdit = (e, id) => {
    let t = todos.filter(i => i.id === id) //t will be an array with just one todo object inside.
    setTodo(t[0].todo) //update the input box
    // todo attribute holds the text inside the todo

    //Deleting that todo 
    let newTodos = todos.filter(item=>{
      return item.id!=id;
    });
    setTodos(newTodos) //adding the new Todo
    saveToLS();

      // Focus the input box
      inputRef.current.focus();
  }

  const handleDelete = (e, id) => {
    //VERY IMP PART TO LEARN -> How to remove items
    if(confirm("Are you sure you want to delete this task!")){
      let newTodos = todos.filter(item=>{
      return item.id!=id;
    })
    setTodos(newTodos)
    saveToLS();
    }
  }

  const handleAdd = () => { //when we click of Add
    if(todo.trim()==="") return; // stop if input is empty
    setTodos([...todos, { id: uuidv4() , todo, isCompleted : false} /*<- this is the new todo*/ ]) //[...todos, ...] → Spread operator creates a new array containing: All existing todos Plus a new todo object at the end:
    //todo → The current text you typed in (from state). isCompleted: false → Marks it as not completed yet.
    setTodo("") //after adding resets the input box.

    saveToLS();
  }

  const handleChange = (e) => { //to handle the input box content dynamically
    setTodo(e.target.value) 
  }

  const handleCheckbox = (e) => {
    let id = e.target.name;
    //first finding the index with the id where event triggered
    let index = todos.findIndex(item=>{ //each ele of todos array is called item
      return item.id === id; //item.id is current todo id, id is the id passed in the method
    })
    //toggling the check box of that id
    let newTodos = [...todos]; //Make a copy of the todos array so I can safely update it without mutating the original state directly. So react can re-render.
    newTodos[index].isCompleted = !newTodos[index].isCompleted; //if true then be false, and if false then be true
    setTodos(newTodos)
    saveToLS();
  }

  return (
    <>
      <Navbar />
      <div className="mx-3 md:container bg-violet-100 md:mx-auto my-2 rounded-xl p-5 min-h-[90vh] md:w-1/2 ">
        <h1 className="font-bold text-center text-xl" >iTask - Manage your Todos at once place</h1>
        <div className="addTodo flex flex-col gap-4 mb-5 ">
          <h2 className="text-lg font-bold">Add a Todo</h2>
          <input ref={inputRef} onChange={handleChange} value={todo} onKeyDown={(e)=>{e.key==="Enter"? todo.trim()!=""?handleAdd():null :null}} type="text" className="bg-white border-b-2 border-b-fuchsia-700 outline-emerald-400 w-full rounded-full px-5 py-1 " placeholder="Write your task here (at least 3 characters)..............................." />
          <button onClick={handleAdd} disabled={todo.length<3} className="bg-violet-400 hover:bg-violet-900 disabled:bg-violet-400 active:bg-red-500 font-bold p-3 py-1 text-white rounded-full transition-transform duration-150 enabled:active:scale-95 " >Add todo</button>
        </div>
        <input type="checkbox" onChange={toggleFinished} checked={showFinished} className="my-4" /> Show Finished
        <hr className="mb-2 opacity-20 w-[90%] m-auto" />
        <h2 className="text-lg font-bold">Your Todos</h2>
        <div className="todos">

          {todos.length==0 && <div className="m-5" > Write some tasks for today. </div> } {/* Conditional Rendering Short syntax */}

          {todos.map(item=>{

            return (showFinished || !item.isCompleted) && <div key={item.id} className="todo flex md:w-9/10 my-3 justify-between">
              <div className="flex gap-5 max-w-[70%] break-words" >
              < input name={item.id} onClick={handleCheckbox} type="checkbox" value={todo.isCompleted} />
                <div className={item.isCompleted?"line-through":""} >{item.todo}</div> 
              </div>
            <div className="buttons flex h-full">
              <button onClick={(e)=>{handleEdit(e, item.id)}} className="bg-violet-600 hover:bg-violet-900 font-bold p-3 py-1 text-white rounded-md mx-2" ><FaEdit/></button>
              <button onClick={(e)=>{handleDelete(e, item.id)}} className="bg-violet-600 hover:bg-violet-900 font-bold p-3 py-1 text-white rounded-md mx-2" ><MdDelete/></button>
                              {/* we can handle onClick like this if we want to send an argument */}
            </div>
          </div>
          })}
        </div>
      </div>
    </>
  );
}

export default App;
