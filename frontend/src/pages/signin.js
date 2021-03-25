/* eslint-disable */
import {useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {postSignin} from "../helper/auth_api";
import "../css/signin_signup.css";

const Signin = (props) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validation, setValidation] = useState({username: "", password: ""});
  
  async function handleSignin(event) {
    event.preventDefault();

    setLoading(true);

    const response = await postSignin(event); 

    if(response && (response.status === 400 || response.status === 404)) {
      const result = await response.json();
      const autherrors = result.autherrors;

      setValidation({
        username: autherrors.username && autherrors.username.msg,
        password: autherrors.password && autherrors.password.msg
      });
    }else if(response && response.status === 200) {
      const {accessToken} = await response.json();

      props.setToken(accessToken);

      setValidation({
        username: "",
        password: "",
      });

      history.push("/dashboard");
    }
    
    setLoading(false);
  }

  return (
    <div id="signin-signup-container">
      <div id="main-container">
        <div id="app-title">
          <h1>Todo List App</h1>
        </div>
        <div id="form-container">
          <form onSubmit={handleSignin}>
            <div className="form-group"> 
              <input 
                type="text" 
                name="username" 
                placeholder="username" 
                disabled={loading}
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <p className="validation-result">{validation.username}</p>
            </div>
            <div className="form-group">
              <input 
                type="password" 
                name="password" 
                placeholder="password" 
                disabled={loading}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <p className="validation-result">{validation.password}</p>
            </div>
            <div className="form-group">
              <button type="submit" className="form-button primary" disabled={loading}>Signin</button>
            </div>          
          </form>
        </div>
        <div className="option-prompt"><p>Don't have an account ? </p></div>
        <div className="form-group">
          <Link to="/signup" className="form-button secondary">Signup</Link>
        </div>
        <div className="option-prompt"><p>or</p></div>
        <div className="skip-auth">
          <p>Sample user: </p>
          <p>username: eleumloyce</p>
          <p>password: eleumloyce</p>
        </div>
      </div>
    </div>
  );
}

export default Signin;