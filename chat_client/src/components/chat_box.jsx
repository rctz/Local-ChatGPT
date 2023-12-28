import { useRef, useState, useEffect } from "react";
import { CodeSection } from "react-code-section-lib";

function ChatBox({ messages, theme }) {
  const chatBoxRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showMessage, setShowMessage] = useState([]);

  useEffect(() => {
    if (messages.length != 0) {
      setShowMessage(messages);
    }
  }, [messages]);

  useEffect(() => {
    if (autoScroll) {
      // Scroll to the bottom of the chat box when new messages are added
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);

  const handleScroll = () => {
    const { scrollHeight, scrollTop, clientHeight } = chatBoxRef.current;
    console.log(scrollHeight - scrollTop);
    console.log(clientHeight);
    // Check if the user has scrolled to the bottom
    const total_scroll = scrollHeight - scrollTop;
    const scroll_height = total_scroll - clientHeight;
    if (
      total_scroll <= clientHeight ||
      (0 < scroll_height && scroll_height < 1)
    ) {
      setAutoScroll(true);
    } else {
      setAutoScroll(false);
    }
  };

  const MessageComponent = ({ index_main, message }) => {
    const { text: fragments, sender } = message;
    return (
      <div
        key={index_main}
        className={`message ${sender === "User" ? "user" : "bot"} ${theme}`}
      >
        <span className="message-sender">{sender}: </span>
        {Array.isArray(fragments) &&
          fragments.map((fragment, index) =>
            fragment.type === "text" ? (
              <p key={index}>{fragment.content}</p>
            ) : (
              <CodeSection
                key={index}
                showLineNumbers={true}
                theme="dark"
                lang={fragment.lang}
              >
                {fragment.content}
              </CodeSection>
            )
          )}
      </div>
    );
  };

  return (
    <div className="chat-box" ref={chatBoxRef} onScroll={handleScroll}>
      {showMessage.map((message, index) => (
        <MessageComponent key={index} index_main={index} message={message} />
      ))}
    </div>
  );
}

export default ChatBox;
