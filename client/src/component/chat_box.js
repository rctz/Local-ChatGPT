import "../css/ChatMessageBox.css";

const ChatMessageBox = ({ messages }) => {
  return (
    <div className="chat-messages">
      {messages.map((message, index) => (
        <div key={index} className="chat-message">
          {message}
        </div>
      ))}
    </div>
  );
};

export default ChatMessageBox;
