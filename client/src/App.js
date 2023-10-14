import React, { useState } from "react";
import ChatButton from "./component/chat_button";
import ChatMessageBox from "./component/chat_box";

function ChatApp() {
  const [messages, setMessages] = useState([]);

  // Function to add a message to the state
  const showMessage = (message) => {
    setMessages([...messages, message]);
  };

  return (
    <div className="chat-container">
      <ChatMessageBox messages={messages} />
      <ChatButton showMessage={showMessage} />
    </div>
  );
}

export default ChatApp;
