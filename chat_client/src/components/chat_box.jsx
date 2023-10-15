import { useRef, useState, useEffect } from "react";

function ChatBox({ messages, theme }) {
  const chatBoxRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (autoScroll) {
      // Scroll to the bottom of the chat box when new messages are added
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);

  const handleScroll = () => {
    const { scrollHeight, scrollTop, clientHeight } = chatBoxRef.current;
    console.log(scrollHeight, scrollTop, clientHeight);
    // Check if the user has scrolled to the bottom
    if (scrollHeight - scrollTop === clientHeight) {
      setAutoScroll(true);
    } else {
      setAutoScroll(false);
    }
  };

  return (
    <div className="chat-box" ref={chatBoxRef} onScroll={handleScroll}>
      {messages.map((message, index) => (
        <div
          key={index}
          className={`message ${
            message.sender === "User" ? "user" : "bot"
          } ${theme}`}
        >
          <span className="message-sender">{message.sender}: </span>
          {message.text}
        </div>
      ))}
    </div>
  );
}

export default ChatBox;
