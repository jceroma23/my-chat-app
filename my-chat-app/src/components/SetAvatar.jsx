import React, { useEffect, useState } from "react";
import axios, { Axios } from "axios";
// import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';

const SetAvatar = () => {
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);
    const authToken = Cookies.get('authToken');
    const navigate = useNavigate();

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
    const token = Cookies.get('authToken');
    if (!token) {
      localStorage.clear();
      Cookies.remove('authToken');
      // No authToken found, user is not logged in, redirect to login page
      navigate("/login");
      return;
    }
  };
  getCurrentUser();
}, [navigate]);

 // get Avatar
 useEffect(() => {
  const getAvatars = async () => {
    const data = [];
    const promises = [];
    let apiKey = 'BKUieHQt4gD29C'
    for (let i = 0; i < 8; i++) {
      let mathRandom = Math.round(Math.random() * 1000)
      let avatarId = '46454582' + mathRandom;
      const promise = fetch('https://api.multiavatar.com/' + avatarId + '.svg?apikey=' + apiKey)
        .then(res => res.text())
        .then(svg => {
          data.push(svg);
        })
        .catch(err => console.error(err));
      promises.push(promise);
    }
    await Promise.all(promises);
    setAvatars(data);
    setIsLoading(false);
  };
  getAvatars();
}, []);

// Handle Set Profile Pic
const setProfilePicture = async () => {
  if (selectedAvatar === undefined) {
    toast.error("Please select an avatar", toastOptions);
  } else {
// Continue to saveAvatar
    const token = Cookies.get('authToken');
    const { userId } = jwtDecode(token);
    const { data } = await axios.post(`${setAvatarRoute}/${userId}`, {
      image: avatars[selectedAvatar],
      userId: userId
    });
//Now if data is set
    if (data.isSet) {
      Cookies.set('authToken', data.token);
      toast.success('Please Relog In, To Update Contacts', toastOptions);
      await new Promise(resolve => setTimeout(resolve, 5000));
      localStorage.clear();
      Cookies.remove('authToken');
      navigate("/");
    } 
  }
};

  return (
   
   <div className="w-screen">
    {isLoading ? (
        <div className="flex justify-center items-center flex-col gap-10 w-screen h-screen">
            <img src={loader} alt="loader" className="loader" />
            <h1 className="text-white text-5xl">LOADING...</h1>
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col gap-10 w-screen h-screen ">
          <div className="border-solid rounded-lg shadow-sm shadow-purple-300 w-3/4 flex flex-col justify-center items-center p-5 bg-gradient-to-r from-purple-500 to-blue-500">
          <div className="title-container text-white">
            <h1 className="text-3xl pb-5 font-bold">Pick an Avatar as your profile picture</h1>
          </div>
          <div className="flex flex-wrap gap-8 w-4/6 justify-center">
          {avatars.map((avatar, index) => {
              return (
                <div className={`transition delay-75 ease-in-out rounded-lg hover:bg-purple-300 ${
                  selectedAvatar === index ? "border-2 bg-purple-500 rounded-lg" : ""
                }`} onClick={() => setSelectedAvatar(index)}>
                  <img
                    src={`data:image/svg+xml,${encodeURIComponent(avatar)}`}
                    alt="avatar"
                    key={index}
                    className="w-24 m-5"
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button onClick={setProfilePicture} className='hover:text-purple-300 text-1xl uppercase mt-1 bg-purple-500 rounded-lg p-3'>
            Set as Profile Picture
          </button>
          <ToastContainer />
        </div>
        </div>
      )}
   </div>
   
  )
}

export default SetAvatar