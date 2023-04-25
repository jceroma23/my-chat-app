import React, { useState } from 'react'
import{ Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
//route
import { loginRoute } from '../utils/APIRoutes';

const Login = () => {
  //clear cookies when login page load
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
if (isLoginPage) {
  Cookies.remove('authToken');
}

  // state to handle the values
  const [values, setValues] = useState({
    username: "",
    password: ""
  })
  const toastOptions = {
    position: "top-left",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  // Handle onChange
  const handleChange = (event) => {
  setValues({ ...values, [event.target.name]: event.target.value });
  };

  // Handle Validation
  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Username and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Username and Password is required.", toastOptions);
      return false;
    }
    return true;
  };
  
  // Handle Submit
   const navigate = useNavigate();
   const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (validateForm()) {
        const { username, password } = values;
      // Handle LogIn
        const { data } = await axios.post(loginRoute, {
          username,
          password
        });
        const token = data.token;
        Cookies.set('authToken', token); // Set the cookie token
        if (data.user.isAvatarImageSet) {
          // If avatar image is set, navigate to chat

          localStorage.setItem('avatarImage', data.user.avatarImage)
          toast.success('Log In Successful! Please wait.', toastOptions);
          await new Promise(resolve => setTimeout(resolve, 3000));
          navigate("/");
        } else {
          // If avatar image is not set, navigate to setAvatar
          toast.success('Log In Successful! Navigating to set Avatar.', toastOptions);
          await new Promise(resolve => setTimeout(resolve, 3000));
          navigate("/setAvatar");
        }
      }
    } catch (error) {
      const { message } = error.response.data;
      toast.error(message, toastOptions);
    }
  }
  
  return (
    <div className='flex justify-center items-center h-screen '>
      <div className='p-5 border-solid rounded-lg shadow-sm shadow-purple-300 bg-gray-900'>
        <h1 className='text-3xl text-center text-gray-400 font-semibold uppercase mb-10'>Sign In</h1> 

        <form onSubmit={(event)=>handleSubmit(event)} className='text-gray-400 flex flex-col space-y-4 w-96 '>
          <input 
          type="text" 
          placeholder='Username' 
          name='username' 
          onChange={(e) => handleChange(e)}
          className='border-2 border-purple-600 p-2 border-solid rounded-lg shadow-sm bg-gray-700 text-lg w-full'
           />
          <input 
          type="password" 
          placeholder='Password' 
          name='password' 
          className='border-2 border-purple-600 p-2 border-solid rounded-lg shadow-sm bg-gray-700 text-lg w-full'
          onChange={(e) => handleChange(e)} 
          />
          <button className='hover:text-purple-600 text-2xl uppercase' type='submit'>SIGN IN</button>
          <div>

          </div>
          <span className='block text-end text-lg'>Dont Have an Account? <Link className='text-purple-600 hover:text-purple-200' to="/register">SIGN UP</Link> </span>
          <ToastContainer />
        </form>
      </div>
    </div>
  )
}

export default Login