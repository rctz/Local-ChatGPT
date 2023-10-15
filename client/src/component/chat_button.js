// ChatButton.js
import React, { useState, useEffect } from "react";
import "../css/SendButton.css";
import Message from "../component/message.js";

const GPT_NAME = "LocalGPT";

// Function to retrieve the CSRF token from cookies
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

const ChatButton = ({ showMessage }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const gptResponse = async (msg) => {
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
          message: msg,
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

  const handleInputMessageChange = (event) => {
    setInputMessage(event.target.value);
  };

  const handleSendMessage = () => {
    const message = inputMessage.trim();
    if (message !== "") {
      showMessage(message, "User");
      // setMessages((prevMessages) => [
      //   ...prevMessages,
      //   { text: message, sender: "User" },
      // ]);
      handleServerResponse(message);
      setInputMessage("");
    }
  };

  const handleServerResponse = async (message) => {
    await gptResponse(message);
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        id="message-input"
        placeholder="Type a message..."
        value={inputMessage}
        onChange={handleInputMessageChange}
      />
      <button
        id="send-button"
        className="send-button"
        onClick={handleSendMessage}
      >
        Send
      </button>
    </div>
  );
};

export default ChatButton;
