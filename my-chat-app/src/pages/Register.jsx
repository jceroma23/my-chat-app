import React, { useEffect, useState } from 'react'
import{ Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios, { Axios } from "axios";
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
//route
import { registerRoute } from '../utils/APIRoutes';

const Register = () => {
  
  // state to handle the values
  const [values, setValues] = useState({
    username: "",
    password: "",
    confirmPassword:"",
    email: ""
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
  const handleValidation = () => {
  const { password, confirmPassword, username, email } = values;
    let isValid = true;
  switch (true) {
    case password !== confirmPassword:
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      isValid = false;
      break;
    case username.length < 6:
      toast.error(
        "Username should be greater than 6 characters.",
        toastOptions
      );
      isValid = false;
      break;
    case password.length < 6:
      toast.error(
        "Password should be equal or greater than 6 characters.",
        toastOptions
      );
      isValid = false;
      break;
    case email === "":
      toast.error("Email is required.", toastOptions);
      isValid = false;
      break;
    default:
      isValid = true;
      break;
  }
  return isValid;
  }

  
   // Handle Submit
   const navigate = useNavigate();
   const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (handleValidation()) {
        const { email, username, password } = values;
        const { data } = await axios.post(registerRoute, {
          email,
          username,
          password,
        });
        console.log(`This is me Data`, data);
        const token = data.token;
        Cookies.set('authToken', token); // Set the cookie token
        localStorage.setItem('avatarImage', data.user.avatarImage)
        toast.success('Sign Up In Successful! Set Up your Avatar', toastOptions);
        await new Promise(resolve => setTimeout(resolve, 3000));
        navigate("/setAvatar");// navigate to chat
      }
    } catch (error) {
      const { message } = error.response.data;
      toast.error(message, toastOptions);
    }
  }
  
  return (
    <div className='flex justify-center items-center h-screen '>
      <div className='p-5 border-solid rounded-lg shadow-sm shadow-purple-300 bg-gray-900'>
        <h1 className='text-3xl text-center text-gray-400 font-semibold uppercase mb-10'>Register</h1> 

        <form onSubmit={(event)=>handleSubmit(event)} className='text-gray-400 flex flex-col space-y-4 w-96 '>
          <input 
          type="text" 
          placeholder='Email' 
          name='email' 
          onChange={(e) => handleChange(e)}
          className='border-2 border-purple-600 p-2 border-solid rounded-lg shadow-sm bg-gray-700 text-lg w-full'
           />
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
          <input 
          type="password" 
          placeholder='Confirm Password' 
          name='confirmPassword' 
          onChange={(e) => handleChange(e)}
          className='border-2 border-purple-600 p-2 border-solid rounded-lg shadow-sm bg-gray-700 text-lg w-full'
           />
          <button className='hover:text-purple-600 text-2xl uppercase' type='submit'>Create Account</button>
          <div>

          </div>
          <span className='block text-end text-lg'>Have an Account? <Link className='text-purple-600 hover:text-purple-200' to="/login">LOG IN</Link> </span>
          <ToastContainer />
        </form>
      </div>
    </div>
  )
}

export default Register