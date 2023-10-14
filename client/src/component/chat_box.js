import "../css/ChatMessageBox.css";
import Message from "./message";
import { useStream } from "./stream_context";

function ChatMessageBox({ messages }) {
  // Filter messages based on sender
  const userMessages = messages.filter((message) => message.sender === "user");
  const botMessages = messages.filter((message) => message.sender === "gpt");

  return (
    <div className="message-box">
      <div className="user-messages">
        {userMessages.map((message, index) => (
          <Message
            key={index}
            message={message.message}
            sender={message.sender}
          />
        ))}
      </div>
      <div className="gpt-messages">
        {botMessages.map((message, index) => (
          <Message
            key={index}
            message={message.message}
            sender={message.sender}
          />
        ))}
      </div>
    </div>
  );
}

export default ChatMessageBox;
