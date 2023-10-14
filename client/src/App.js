import React, { useState } from "react";
import ChatButton from "./component/chat_button";
import ChatMessageBox from "./component/chat_box";
import { StreamProvider } from "./component/stream_context";

function ChatApp() {
  const [messages, setMessages] = useState([]);

  const showMessage = (message, sender) => {
    const newMessage = { message, sender };
    console.log(newMessage);
    //setMessages((messages) => [...messages, newMessage]);
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="chat-container">
      <ChatMessageBox messages={messages} />
      <ChatButton showMessage={showMessage} />
    </div>
  );
}

export default ChatApp;
