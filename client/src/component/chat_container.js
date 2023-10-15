import React, { useState } from "react";
import ChatButton from "./chat_button";
import ChatMessageBox from "./chat_box";
import "../css/ChatInterfaces.css";

function ChatInterface() {
  const [messages, setMessages] = useState([]);

  const showMessage = (rcv_message, sender) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      if (lastMessage && lastMessage.sender === sender) {
        return [
          ...prevMessages.slice(0, -1),
          { text: lastMessage.text + rcv_message, sender: sender },
        ];
      } else {
        return [...prevMessages, { text: rcv_message, sender: sender }];
      }
    });
  };

  return (
    <div className="chat-interface-container">
      <ChatMessageBox messages={messages} />

      <ChatButton showMessage={showMessage} />
    </div>
  );
}

export default ChatInterface;
