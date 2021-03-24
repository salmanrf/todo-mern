export const postSignin = async (event) => {
  const body = new FormData(event.target);
  const user = {username: body.get("username"), password: body.get("password")};

  try {
    const response = await fetch("http://127.0.0.1:8080/api/auth/signin", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user)
    });

    return response;
    
  } catch(err) {
      console.log(err);
  }
  
}

export const postSignup = async (event) => {
  const body = new FormData(event.target);
  const user = {username: body.get("username"), password: body.get("password")};

  try {
    const response = await fetch("http://127.0.0.1:8080/api/auth/signup", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user)
    });

    return response;

  } catch(err) {
      console.log(err);
  }
}

export const getSignout = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8080/api/auth/signout", {credentials: "include"});

    return response;

  } catch(err) {
    console.log(err);
  }
}

export const getRefreshToken = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8080/api/token", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    });

    return response;
  } catch(err) {
      console.log(err);
  }
}


