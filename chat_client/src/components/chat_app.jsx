import React, { useState, useEffect } from "react";
import ChatBox from "./chat_box";
import MessageInput from "./message_input";
import ThemeSwitcher from "./theme_switcher";
import { DefineMessageType } from "../utils/MessageFormat";

const GPT_NAME_TEMP = "LocalGPT_temp";
const GPT_NAME = "LocalGPT";
const USER_NAME = "User";
const BACKEND_API = "http://192.168.1.47:8000"; 

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
  const [theme, setTheme] = useState("light"); // Add theme state

  useEffect(() => {
    async function fetchInitialChat() {
      try {
        // const response = await fetch("/api/initial_chat", {
        const response = await fetch(`${BACKEND_API}/api/initial_chat`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json, text/plain, */*",
          },
        });

        const response_json = await response.json();

        for (let i = 0; i < response_json["chat_history"].length; i++) {
          const message = response_json["chat_history"][i];
          let sender = USER_NAME;
          if (message["role"] === "assistant") {
            sender = GPT_NAME;
          }

          showInitialMessage(message["content"], sender);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchInitialChat();
  }, []);

  const showInitialMessage = (message, sender) => {
    setMessages((prevMessages) => {
      const carifyMessageType = DefineMessageType(message);
      const newMessage = { text: carifyMessageType, sender: sender };
      return [...prevMessages, newMessage];
    });
  };

  const showMessage = (message, sender) => {
    setMessages((prevMessages) => {
      // For showing complete message with code section
      // After complete prepare complete message, the temp stream message will be deleted
      if (sender === GPT_NAME) {
        const carifyMessageType = DefineMessageType(message);

        const newMessage = { text: carifyMessageType, sender: sender };
        return [...prevMessages.slice(0, -1), newMessage];
      } else {
        const lastMessage = prevMessages[prevMessages.length - 1];
        // Deep clone of lastMessage to avoid modifying the original object directly
        const clonedLastMessage = lastMessage
          ? JSON.parse(JSON.stringify(lastMessage))
          : null;

        // For showing temp stream message, in case of there is word in the message
        if (
          clonedLastMessage &&
          clonedLastMessage.sender === sender &&
          Array.isArray(clonedLastMessage.text) &&
          clonedLastMessage.text.length > 0
        ) {
          let lastText =
            clonedLastMessage.text[clonedLastMessage.text.length - 1];
          if (lastText && typeof lastText.content === "string") {
            lastText.content += message;
            return [...prevMessages.slice(0, -1), clonedLastMessage];
          }
        } else {
          const newFragment = { type: "text", lang: "en", content: message };
          // For showing temp stream message, in case of no word in the message
          if (clonedLastMessage && clonedLastMessage.sender === sender) {
            // If the last message exists and is from the same sender, add to its text array
            clonedLastMessage.text.push(newFragment);
            return prevMessages;
          } else {
            // Otherwise, create a new
            return [...prevMessages, { text: [newFragment], sender: sender }];
          }
        }
      }
    });
  };

  const handleSend = async () => {
    // Set user message
    if (newMessage) {
      showMessage(newMessage, USER_NAME);
      // setMessages([...messages, { text: newMessage, sender: USER_NAME }]);
      

      const csrfToken = getCookie("csrftoken");
      try {
        // const response = await fetch("/api/chat_stream", {
        // console.log(newMessage);
        const response = await fetch(`${BACKEND_API}/api/chat_stream`, {
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
        setNewMessage("");
        console.log(response);

        if (response.ok) {
          const reader = response.body.getReader();

          let text = "";
          let textAll = "";
          while (true) {
            const { done, value } = await reader.read();
            text = new TextDecoder().decode(value);
            textAll = textAll + text;
            // console.log(textAll);
            if (done) {
              // For showing complete message with code section
              showMessage(textAll, GPT_NAME);
              break;
            }
            // For showing temp stream message
            showMessage(text, GPT_NAME_TEMP);
          }
        } else {
          showMessage("asddasd", GPT_NAME_TEMP);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent line break
      handleSend(); // Trigger the send message function
    }
  };

  return (
    <div
      className={`main-app ${theme === "dark" ? "dark-theme" : "light-theme"}`}
    >
      <ThemeSwitcher onThemeChange={handleThemeChange} />
      <div className="chat-app">
        <ChatBox
          messages={messages}
          theme={theme === "dark" ? "dark-theme" : "light-theme"}
        />
        <MessageInput
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onSend={handleSend}
          onKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
}

export default ChatApp;
