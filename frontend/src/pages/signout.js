/* eslint-disable */
import {useEffect} from "react";
import {Redirect} from "react-router-dom";

import {getSignout} from "../helper/auth_api";

const Signout = (props) => {
  useEffect(() => {
    getSignout()
      .then(res => {
        if(res.status === 200)
          props.setToken(null);
      });
  }, []);  

  return (
    <Redirect to="/dashboard"/>
  );
}

export default Signout;