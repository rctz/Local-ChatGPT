import "../css/ChatMessageBox.css";
import Message from "./message";
import { useStream } from "./stream_context";

function ChatMessageBox({ messages }) {
  console.log(messages);
  return (
    <div className="message-box">
      {messages.map((message, index) => (
        <Message
          key={index}
          message={message.message}
          sender={message.sender}
        />
      ))}
    </div>
  );
}

export default ChatMessageBox;
