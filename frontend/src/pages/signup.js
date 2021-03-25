/* eslint-disable */
import {useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {postSignup} from "../helper/auth_api";
import "../css/signin_signup.css";

const Signup = () => {
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validation, setValidation] = useState({username: "", password: ""});
  
  const handleSignup = async (event) => {
    event.preventDefault();
    
    setLoading(true);
    
    const response = await postSignup(event); 

    if(response && response.status === 400) {
      const result = await response.json();
      const autherrors = result.autherrors;
      
      setValidation({
        username: autherrors.username && autherrors.username.msg,
        password: autherrors.password && autherrors.password.msg
      });
    } else if(response && response.status === 201) {
      setValidation({
        username: "",
        password: "",
      });
      
      history.push("/signin");
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
          <form onSubmit={handleSignup}>
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
              <button type="submit" className="form-button primary" disabled={loading}>Signup</button>
            </div>          
          </form>
        </div>
        <div className="option-prompt"><p>Already have an account ? </p></div>
        <div className="form-group">
          <Link to="/signin" className="form-button secondary">Signin</Link>
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

export default Signup;