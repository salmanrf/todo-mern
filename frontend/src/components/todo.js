import {useState, useEffect, useContext} from "react";
import {RiEditBoxLine, RiDeleteBin4Line} from "react-icons/ri";
import {AiOutlineSave} from "react-icons/ai";
import {GoCheck} from "react-icons/go";

import {createTodo, deleteTodo, updateTodo} from "../helper/todo_api";

import {TokenContext} from "../context_store";
import {formatDate} from "../helper/date";

const Todo = (props) => {
  const token = useContext(TokenContext);
  const [todo, setTodo] = useState(props.todo);
  const [form, setForm] = useState({
    title: todo.title, 
    description: todo.description, 
    due_date: todo.due_date,
    complete: todo.complete || false
  });

  const [isFetching, setIsFetching] = useState(false);
  const [editMode, setEditMode]  = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  console.log(todo);

  async function handleUpdate() {
    setIsFetching(true);  

    let response;

    if(todo.new) 
      response = await createTodo(form, props.collectionId, token);
    else 
      response = await updateTodo(todo._id, form, token);

    if(response.status === 200) {
      const result = await response.json();

      setTodo({...result.todo, new: false});
    }

    setIsFetching(false);
  }

  async function toggleCheck() {
    setIsFetching(true);  

    const response = await updateTodo(todo._id, {complete: !todo.complete}, token);
    if(response.status === 200) {
      const result = await response.json();
      
      setTodo({...result.todo, new: false});
      console.log(todo);
    }

    setIsFetching(false);
  }

  async function handleDelete(id) {
    setIsFetching(true);
    
    if(todo.new) {
      props.removeTodo(id);
    }else {
      const response = await deleteTodo(id, token);
      
      if(response.status === 200)
        props.removeTodo(id);
    }
    setIsFetching(false);
  }
 
  useEffect(() => {
    setIsMounted(true);

    if(todo.new)
      setEditMode(true);
      
    return () => {
      setIsMounted(false);
    }
  }, []);

  useEffect(() => {
    if(editMode) 
      setShowDesc(true);
    else
      setShowDesc(false);
  }, [editMode]);

  return (
    <>
      <div className="todo" style={{transform: isMounted ? "scale(100%)" : "scale(0%)"}}>
          {/* use "{{}}" to pass an object as a prop */}
          {isFetching && 
            <div className="todo-overlay"></div>
          }
          <TodoMain 
            todo={todo} 
            toggleCheck={toggleCheck}
            updateTodo={() => handleUpdate()}
            deleteTodo={() => handleDelete(todo._id)} 
            toggleDesc={{showDesc, setShowDesc}} 
            editMode={{editMode, setEditMode}}
            form={form}
            setForm={setForm}
          />
          <TodoDesc 
            todo={todo} 
            toggleDesc={{showDesc}} 
            editMode={{editMode}}
            form={form}
            setForm={setForm}
          />
        </div>
    </>
  );
}

const TodoMain = (props) => {
  const {todo, form, setForm} = props;
  const {showDesc, setShowDesc} = props.toggleDesc;
  const {editMode, setEditMode} = props.editMode;

  return (
    <div className="todo-main">
      {!todo.new && 
        <div className="todo-mark-complete" onClick={props.toggleCheck}>
          {todo.complete && 
            <GoCheck />
          }
        </div>
      }
      <div className="todo-info" onClick={() => setShowDesc(!showDesc)}>
        {!editMode ? 
          <>
            <div className="todo-title">{todo.title}</div>
            <div className="todo-duedate">{formatDate(todo.due_date)}</div>
          </>
          :
          <>
            <input 
              className="todo-edit-form" 
              type="text" 
              name="title" 
              value={form.title}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
            />
            <input 
              className="todo-edit-form" 
              type="date" 
              name="due_date" 
              value={form.due_date}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
            />
          </>
        }
      </div>
      <div className="todo-action">
        {!editMode ?
          <div className="edit action-icon" onClick={() => setEditMode(!editMode)}><RiEditBoxLine /></div>  
          :
          <div 
            className="edit action-icon" 
            onClick={() => {
              props.updateTodo();
              setEditMode(!editMode);
            } 
          }>
            <AiOutlineSave />
          </div>  
        }
        <div className="delete action-icon" onClick={props.deleteTodo}>
          <RiDeleteBin4Line />
        </div>
      </div>
    </div>
  );
}

const TodoDesc = (props) => {
  const {todo, form, setForm} = props;
  const {showDesc} = props.toggleDesc;
  const {editMode} = props.editMode;

  return (
    <div className="todo-description" style={{height: showDesc ? "120px" : "0"}}>
      {!editMode ?
        <p>{todo.description}</p>
        :
        <textarea 
          className="todo-edit-form" 
          name="description" 
          value={form.description}
          onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
        />
      }   
    </div>
  ); 
}

export default Todo;