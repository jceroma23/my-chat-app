import React, { useState } from 'react'
import SendIcon from '@mui/icons-material/Send';
import InputEmoji from "react-input-emoji";
const ChatInput = ({ handleSendMsg }) => {
  const [msg, setMsg] = useState("");

  const sendChat = (event) => {
    event.preventDefault();
    const message = msg;
    handleSendMsg(message);
    setMsg("");
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      sendChat(event);
    }
  };

const handleOnChange = (text) => {
    setMsg(text);
    console.log(msg);
  }
  
  return (
    <div className='flex justify-center items-end h-20 w-full'>
  
        <form className="flex gap-3 w-3/4" onSubmit={(event) => sendChat(event)}>
        <InputEmoji
          placeholder="Type your message here"
          onChange={handleOnChange}
          cleanOnEnter
          onResize="50"
          name={msg}
          value={msg}
          onKeyDown={handleKeyDown}
          />
          <button type="submit">
            <SendIcon />
          </button>
        </form>
    </div>
  )
}

export default ChatInput