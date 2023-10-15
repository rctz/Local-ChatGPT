import React, { useState } from "react";
import ChatButton from "./component/chat_button";
import ChatMessageBox from "./component/chat_box";
import ChatInterface from "./component/chat_container";

function ChatApp() {
  return (
    <div className="chat-container">
      <ChatInterface />
    </div>
  );
}

export default ChatApp;
