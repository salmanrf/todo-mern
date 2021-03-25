/* eslint-disable */
import {useState, useEffect, useContext} from "react";
import {useParams} from "react-router-dom";
import {v4 as uuidv4} from "uuid";
import {CgAddR} from "react-icons/cg";

import {TokenContext} from "../context_store";

import Todo from "./todo";
import {getTodos} from "../helper/todo_api";
import {formatDate} from "../helper/date";

const TodoBoard = () => {
  return (
    <div id="todo-board">
      <CollectionContainer />
    </div>
  );
}

const CollectionContainer = () => {
  const params = useParams();
  const userToken = useContext(TokenContext);
  const [collection, setCollection] = useState({});
  const [todos, setTodos] = useState([]);

  function removeFromList(id) {
    setTodos(todos.filter(todo => todo._id !== id));
  }

  useEffect(() => {
    getTodos(params.collection, userToken)
    .then(res => res && res.json())
    .then((collection) => {
      setCollection(collection);
      setTodos(collection.todos);
      document.title = `Dashboard: ${collection.title || collection.name}`;
    })
    .catch(() => setTodos([]));
  }, [params]);

  return (
    <div className="collection-container">
      <CollectionHeader 
        createTodo={() => {
          setTodos([...todos, 
            {
              _id: uuidv4(),
              name: "",
              description: "",
              due_date: new Date(),
              complete: false,
              new: true,
            }]);
          }
        } 
        collection={collection}
      />
      <TodoList collectionId={collection._id} removeFromList={removeFromList} todos={todos}/>
    </div>
  );
}

const CollectionHeader = (props) => {
  return (
    <div className="collection-header">
      <div className="collection-info">
        <div className="collection-title">{props.collection.name || props.collection.title}</div>
        {props.collection && props.collection.title === "Today" &&
          <div className="collection-date">{formatDate(new Date())}</div>
        }
      </div>
      <div className="collection-control">
        <div className="new-todo" onClick={props.createTodo}>
          <CgAddR />
          <span>Add Todo</span>
        </div>
      </div>
    </div>
  );
}

const TodoList = (props) => {
  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
    setTodoList([...props.todos]);
  }, [props.todos]);

  return (
    <div className="todo-list">
      {
        todoList.map(todo => (
          <Todo 
            collectionId={props.collectionId} 
            todo={todo} 
            removeTodo={props.removeFromList} 
            key={todo._id}
          />
        ))
      }
    </div>
  );
}

export default TodoBoard;