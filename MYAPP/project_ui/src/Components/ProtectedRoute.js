import { Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from "./Login/LoginPage"; 
import { useEffect } from 'react';
import Cookies from 'js-cookie';


const ProtectedRoute = (props) => {
 
const {Component}=props;
const navigate=useNavigate();
useEffect(()=>{
    let login=Cookies.get("sessionToken");
    if(!login){
        navigate('/')
    }
})
  return (
       <div>
            <Component></Component>
       </div>
      );
};

export default ProtectedRoute;
