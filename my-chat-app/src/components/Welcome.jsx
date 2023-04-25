import React from 'react'
import loader from "../assets/loader.gif";
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';
const Welcome = () => {
  const token = Cookies.get('authToken');
  const userData = jwtDecode(token);
  return (
    <div className="flex justify-center items-center flex-col gap-10 w-full h-full">
            <img src={loader} alt="loader" className="h-36" />
            <div>
            <h3 className="text-white text-3xl">Hi! <span className='text-rose-800'>{userData.username}</span></h3>
            <span className="text-pink-700 text-3xl text-center">Lets Chat? :)</span>
            </div>
    </div>
  )
}

export default Welcome