import React, { useState, useEffect } from 'react'
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

const Contacts = ({contacts, changeChat}) => {
  const navigate = useNavigate();
  const token = Cookies.get('authToken');
  const userData = jwtDecode(token);
  const getAvatarImage = localStorage.getItem('avatarImage')
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  if (!contacts) {
    return (
      <div className="flex items-center justify-center h-full">
        <FaSpinner className="animate-spin mr-2" />
        Loading contacts...
      </div>
    );
  }

  useEffect(() => {
    const getUserData = async () => {
      try {
        setCurrentUserName(userData.username);
        setCurrentUserImage(getAvatarImage);
      } catch (error) {
        console.error(error);
        navigate('/login');
      }
    };
    getUserData();
  }, [navigate]);
  
  // useEffect(async () => {
    
  //   setCurrentUserName(userData.username);
  //   setCurrentUserImage(userData.avatarImage);
  // }, []);

  // const changeCurrentChat = (index, contact) => {
  //   setCurrentSelected(index);
  //   changeChat(contact);
  // };
  const changeCurrentChat = (index, contact) => {
    if (index !== currentSelected) {
      setCurrentSelected(index);
      changeChat(contact);
    }
  };
  return (
    <>
      {currentUserImage && (
        <div className='grid grid-flow-row overflow-hidden w-1/4 bg-gray-900 rounded-lg'>
          <div>
            <h3 className='text-center p-1 text-purple-300 bg-indigo-600'>Connect with People</h3>
          </div>
          <div className="flex flex-col items-center overflow-auto space-x-3">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`h-20 cursor-pointer bg-purple-500 rounded-lg mb-2 w-11/12 p-1 flex gap-3 items-center transition delay-75 ease-in-out ${
                    index === currentSelected ? "bg-purple-900 rounded-lg" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="h-12">
                    <img
                      src={`data:image/svg+xml,${encodeURIComponent(contact.avatarImage)}`}
                      alt=""
                      className='h-11'
                    />
                  </div>
                  <div>
                    <h3 className='text-purple-300'>{contact.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-indigo-800 flex justify-center items-center gap-8 rounded-md p-1">
            <div>
              <img
                src={`data:image/svg+xml,${encodeURIComponent(currentUserImage)}`}
                alt="avatar"
                className="h-10 inline"
              />
            </div>
            <div className="text-indigo-400">
              <h2 className='text-lg'>{currentUserName}</h2>
            </div>
          </div>
        </div>
      )}
    </>
  //   <div className='grid grid-flow-row overflow-hidden h-screen'>
  //   {currentUserImage && (
  //     <div className='grid grid-flow-row overflow-hidden h-44'>
  //       <div>
  //         <h3>Connect with People</h3>
  //       </div>
  //       <div className="flex flex-col items-center overflow-auto space-x-3">
  //         {contacts.map((contact, index) => {
  //           return (
  //             <div
  //               key={contact._id}
  //               className={`h-20 cursor-pointer w-11/12 rounded-sm p-1 flex gap-4 items-center transition delay-75 ease-in-out ${
  //                 index === currentSelected ? "bg-purple-600" : ""
  //               }`}
  //               onClick={() => changeCurrentChat(index, contact)}
  //             >
  //               <div className="h-12">
  //                 <img
  //                   src={`data:image/svg+xml;base64,${contact.avatarImage}`}
  //                   alt=""
  //                   className='h-12'
  //                 />
  //               </div>
  //               <div>
  //                 <h3 className='text-purple-300'>{contact.username}</h3>
  //               </div>
  //             </div>
  //           );
  //         })}
  //       </div>
  //       <div className="bg-indigo-800 flex justify-center items-center gap-8">
  //         <div>
  //           <img
  //             src={`data:image/svg+xml,${encodeURIComponent(currentUserImage)}`}
  //             alt="avatar"
  //             className='h-16 inline'
  //           />
  //         </div>
  //         <div className="text-indigo-400">
  //           <h2 className='text-lg'>{currentUserName}</h2>
  //         </div>
  //       </div>
  //     </div>
  //   )}
  // </div>
  )
}

export default Contacts