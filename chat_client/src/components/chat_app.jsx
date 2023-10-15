import React, { useState } from "react";
import ChatBox from "./chat_box";
import MessageInput from "./message_input";

const GPT_NAME = "LocalGPT";
const USER_NAME = "User";

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const showMessage = (message, sender) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      if (lastMessage && lastMessage.sender === sender) {
        return [
          ...prevMessages.slice(0, -1),
          { text: lastMessage.text + message, sender: sender },
        ];
      } else {
        return [...prevMessages, { text: message, sender: sender }];
      }
    });
  };

  const handleSend = async () => {
    // Set user message
    if (newMessage) {
      setMessages([...messages, { text: newMessage, sender: USER_NAME }]);
      setNewMessage("");
    }

    const csrfToken = getCookie("csrftoken");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat_stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          message: newMessage,
        }),
      });

      const reader = response.body.getReader();

      let text = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        text = new TextDecoder().decode(value);
        showMessage(text, GPT_NAME);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="chat-app">
      <ChatBox messages={messages} />
      <MessageInput
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onSend={handleSend}
      />
    </div>
  );
}

export default ChatApp;
