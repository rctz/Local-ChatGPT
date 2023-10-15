import "../css/ChatMessageBox.css";
import Message from "./message";
import { useStream } from "./stream_context";

function ChatMessageBox({ messages }) {
  // Filter messages based on sender

  const nestedMessages = messages.reduce((acc, message) => {
    const messageText = message.text.trim();
    if (messageText.startsWith("```")) {
      const nestedMessageText = messageText.slice(3, -3).trim();
      console.log(nestedMessageText);
      acc.push(
        <Message
          key={acc.length}
          className={`message ${message.sender}`}
          message={message.text
            .replace(`'''${nestedMessageText}'''`, "")
            .trim()}
          sender={message.sender}
        >
          <Message
            key={acc.length + 1}
            className={`message_code ${message.sender}`}
            message={nestedMessageText}
            sender={message.sender}
          />
        </Message>
      );
    } else {
      acc.push(
        <Message
          key={acc.length}
          className={`message ${message.sender}`}
          message={message.text}
          sender={message.sender}
        />
      );
    }
    return acc;
  }, []);

  return <div className="chat-section">{nestedMessages}</div>;
}

export default ChatMessageBox;
