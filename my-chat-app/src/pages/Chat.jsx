import React, { useState, useEffect, useRef } from 'react'
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host } from "../utils/APIRoutes"
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatC from '../components/ChatC';

const Chat = () => {
   // Get the token from the cookie and decode Token
    const socket = useRef();
    const navigate = useNavigate();
    const token = Cookies.get('authToken');
    const userData = jwtDecode(token);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [contacts, setContacts] = useState([]);
    const [currentChat, setCurrentChat] = useState(undefined);

    //This is needed so i before rendering the contact it will wait on getting the data on database
    const [loading, setLoading] = useState(true)

    const toastOptions = {
      position: "top-left",
      autoClose: 5000,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
  };

  // When Not Login. Go Back to Login Page
  useEffect(() => {
    const getCurrentUser = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!token) {
        localStorage.clear();
        // No authToken found, user is not logged in, redirect to login page
        navigate("/login");
        return;
      } else {
        setCurrentUser(userData);
      };
    };
    getCurrentUser();
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser.userId);
    }
  }, [currentUser]);

  // check Avatar and GetContacts
  useEffect(() => {

    const getContacts = async () => {
    if (currentUser) { 
      if (currentUser.isAvatarImageSet) {
        try {
          const { data } = await axios.get(`${allUsersRoute}/${currentUser.userId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
          );
          console.log("Fetched contacts:", data.users);
          setContacts(data.users);
          setLoading(false);
        } catch (error) {
          const { message } = error.response.data;
          toast.error(message, toastOptions);
        }
      } else {
        navigate("/setAvatar");
      }
    }
  }
  getContacts();
  }, [currentUser]);


  
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
    console.log('Chatchange', chat);
  };

   return (
  <div className='min-w-full h-screen flex flex-col justify-center items-center mb-5'>
    <div className='flex justify-between flex-col space-y-3 mb-5'>
      <h1 className='text-6xl text-center bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text tracking-tight'>CHAT APP</h1>
      <span className='text-2xl text-center text-purple-300'>Welcome, {userData.username}!</span>
    </div>
    <div className='w-5/6 h-4/5 border-solid rounded-lg shadow-sm shadow-purple-300 flex p-1 bg-gradient-to-r from-purple-500 to-blue-500'>
      <div className='w-full h-full rounded-md '>
        {loading ? (
          <div className='flex justify-center items-center h-full'>
            <svg className='animate-spin h-10 w-10 text-purple-300' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
              <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm12 0a8 8 0 018 8v-2a6 6 0 00-6-6H8V12h8zm-6 6a6 6 0 006-6h-2a4 4 0 01-4 4v2z'></path>
            </svg>
          </div>
        ) : (
          <div className='h-full flex gap-5 bg-gray-900 bg-opacity-25'>
            <Contacts contacts={contacts} changeChat={handleChatChange} />
            {currentChat === undefined ? (
            <Welcome />
            ) : (
              <div className='p-1 w-full h-full'>
                <ChatC currentChat={currentChat} currentUser={currentUser} socket={socket} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);
}

export default Chat