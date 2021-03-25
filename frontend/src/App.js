/* eslint-disable */
import React, {useState, useEffect} from "react";
import {
  Switch,
  Route,
  Redirect,
  // Link,
  // useRouteMatch,
  // useParams
  useHistory
} from "react-router-dom";
import jwt_decode from "jwt-decode";

import {UserContext, TokenContext} from "./context_store";

import Dashboard from "./pages/dashboard";
import Signin from "./pages/signin";
import Signup from "./pages/signup";
import Signout from "./pages/signout";
import {getRefreshToken} from "./helper/auth_api";

const App = () => {
  let history = useHistory();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // JWT is stored in-memory, so when application initially loads
    // send a request with refresh token in httpOnly cookie for new token 
    getRefreshToken()
      .then(res => {
        // There is no refresh token stored in cookie
        if(res.status === 401) {
          setLoading(false);
          // Unauthorized, redirect to signin page
          history.push("/signin");
        }else if(res.status === 202) {
          // Success, parse response

          return res.json();
        }
      })
      .then(result => {
        // Set the token context with new token
        setToken(result.accessToken);
      })
      // if request failed for any reason, redirect to signin page
      .catch(() => history.push("/signin"));
  }, []);

  useEffect(() => {
    try {
      setUser(jwt_decode(token));    
      history.push("/dashboard");  

      setTimeout(async () => {
        const res = await getRefreshToken();

        if(res.status === 401) {
          history.push("/signin");
        }else if(res.status === 202) {
          const {accessToken} = await res.json();

          setToken(accessToken);
        }
      }, 1000 * 60 * 15);
    }catch {
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  return (
    <div className="app">
      <UserContext.Provider value={user}>
        <TokenContext.Provider value={token}>
          <Switch>
            <Route path="/signin" component={Signin}>
              <Signin setToken={setToken}/>
            </Route>
            <Route path="/signup" component={Signup}/>
            <Route path="/signout">
              <Signout setToken={setToken} />
            </Route>
            <Route path="/dashboard">
              {user ?
                <Dashboard />
                :
                (loading ? 
                  null
                  :
                  <Redirect to="/signin"/>
                )
              }
            </Route>
            <Route exact path="/">
              <Redirect to="/dashboard" />
            </Route>
        </Switch>
        </TokenContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
