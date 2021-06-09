export const getTodos = async (collectionName, token) => {
  try {
    const response = await fetch(`https://srf-todo-list.herokuapp.com/api/todo/${collectionName || ""}`,
     {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    return response;
  }catch(err) {
    console.error(err);
  }
}

export const createTodo = async (todo, collectionId, token) => {
  try {
    const response = await fetch(`https://srf-todo-list.herokuapp.com/api/todo/?collectionId=${collectionId || ""}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }, 
      body: JSON.stringify(todo)
    });

    return response;
  }catch(err) {
    console.error(err);
  }
}

export const updateTodo = async (todoId, todo, token) => {
  try {
    const response = await fetch(`https://srf-todo-list.herokuapp.com/api/todo/${todoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }, 
      body: JSON.stringify(todo)
    });

    return response;
  }catch(err) {
    console.error(err);
  }
}

export const deleteTodo = async (todoId, token) => {
  try {
    const response = await fetch(`https://srf-todo-list.herokuapp.com/api/todo/${todoId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }, 
    });

    return response;
  }catch(err) {
    console.error(err);
  }
}

export const getCollectionsAll = async (token) => {
  try {
    const response = await fetch("https://srf-todo-list.herokuapp.com/api/todo/collection", {
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });

    return response;
  }catch(err) {
    console.error(err);
  }
}

export const postNewCollection = async (name, token) => {
  try {
    const response = await fetch("https://srf-todo-list.herokuapp.com/api/todo/collection/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({name})
    });

    return response;
  }catch(err) {
    console.log(err);
  }
}