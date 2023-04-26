import React, { useEffect, useState, useRef } from 'react'
import Logout from './Logout'
import ChatInput from './ChatInput';
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import { v4 as uuidv4 } from "uuid";

const ChatC = ({ currentChat, currentUser, socket }) => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  //Handle Recieve Message
  useEffect(() => {
    const getMessages = async () => {
      const response = await axios.post(recieveMessageRoute, {
        from: currentUser.userId,
        to: currentChat._id,
      });
      console.log('this is current Ueser', currentUser.userId)
      setMessages(response.data);
      setLoading(false);
      console.log('response.data', response.data);
    };
    getMessages();
  }, [currentChat, currentUser]);

// To get current chat or whom you are messaging
  useEffect(() => {
    const getCurrentChat = async () => {
      currentChat._id;
    };
    getCurrentChat();
  }, [currentChat]);

  // Handle Sent Message
  const handleSendMsg = async (msg) => {
    // console.log('Cuurent User', currentUser.userId);
    // console.log('To send User', currentChat._id);
    // console.log('this is the message', msg);
    await axios.post(sendMessageRoute, {
      from: currentUser.userId,
      to: currentChat._id,
      message: msg
    })
    socket.current.emit('send-msg', {
      from: currentUser.userId,
      to: currentChat._id,
      message: msg
    })
    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
        console.log('this is from arrivalMessage', msg)
      });
    }
  }, []);
  
  useEffect(() => {
    console.log('arrivalMessage:', arrivalMessage);
    if (arrivalMessage !== null) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);


  // useEffect(() => {
  //   arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  //   console.log(arrivalMessage);
  // }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log(messages)
  }, [messages]);



  return (
    <div className='flex flex-col gap-1 overflow-hidden w-11/12'>
      <div className='flex  justify-between py-0 px-8 w-full h-15'>
        <div className='flex items-start w-1/4 gap-4 mt-2'>
           <div> {/*  image set of current index chat */}
                <img
              src={`data:image/svg+xml,${encodeURIComponent(currentChat.avatarImage)}`}
              alt="avatar"
              className='h-11'
              />
          </div>
          <div>
            <h3 className='text-purple-300'>{currentChat.username}</h3>
          </div>
        </div>
        <Logout />
      </div>
            <div className='p-1 flex flex-col space-y-4 overflow-auto h-80 w-full'>
            {messages.map((message) => {
                return (
                  <div className='' ref={scrollRef} key={uuidv4()}>
                    <div
                      className={`flex items-center ${
                        message.fromSelf ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div className={`w-5/12 break-words p-1 text-lg rounded-2xl text-gray-100 ${
                        message.fromSelf ? "bg-purple-900" : "bg-gray-600"
                      }`}>
                        <p>{message.message}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
      <div className='flex items-end'>
        <ChatInput handleSendMsg={handleSendMsg}/>
      </div>
    </div>
  )
}

export default ChatC