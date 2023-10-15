function ChatBox({ messages }) {
  return (
    <div className="chat-box">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`message ${message.sender === "User" ? "user" : "bot"}`}
        >
          <span className="message-sender">{message.sender}: </span>
          {message.text}
        </div>
      ))}
    </div>
  );
}

export default ChatBox;
