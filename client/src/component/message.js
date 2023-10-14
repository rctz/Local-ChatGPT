import React from "react";
import "../css/Message.css";

function Message({ message, sender }) {
  console.log(message, sender);
  return (
    <div className={sender === "user" ? "user-message" : "gpt-message"}>
      <span className="message-sender">{sender}: </span>
      {message}
    </div>
  );
}

export default Message;
