import Cookies from 'js-cookie';
import React from 'react'
import { useNavigate } from "react-router-dom";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
const Logout = () => {
  //A simple Log Out not yet able to log out on BackEnd server Params
  const Navigate = useNavigate();
        const handleLogOut = async () => {
          localStorage.clear();
          Cookies.remove('authToken');
          Navigate('/login');
        }
  return (
    <div>
      <button className='rounded-md bg-purple-900 text-purple-100 p-2 hover:bg-purple-300 hover:text-purple-950' onClick={handleLogOut} >
      <ExitToAppIcon />
      </button>
    </div>
  )
}

export default Logout