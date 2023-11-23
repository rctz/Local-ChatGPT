import { useRef, useState, useEffect } from "react";
import {CodeSection} from "react-code-section-lib"

function ChatBox({ messages, theme }) {
  const chatBoxRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);
  

  useEffect(() => {
    console.log(autoScroll);
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
      console.log("Auto scroll");
      setAutoScroll(true);
    } else {
      console.log("Not Auto scroll");
      setAutoScroll(false);
    }
  };

  const MessageComponent = ({ index_main, message }) => {
    const { text: fragments, sender } = message;

    return (
      <div
        key={index_main}
        className={`message ${
          sender === "User" ? "user" : "bot"
        } ${theme}`}
      >
        <span className="message-sender">{sender}: </span>
        {Array.isArray(fragments) && fragments.map((fragment, index) => (
          fragment.type === 'text' ? (
            <p key={index}>{fragment.content}</p>
          ) : (
            <CodeSection key={index} showLineNumbers theme='dark' lang={fragment.lang}>
              {fragment.content}
            </CodeSection>
          )
        ))}
      </div>
    );
  }
  
  return (
    <div className="chat-box" ref={chatBoxRef} onScroll={handleScroll}>
      {messages.map((message, index) => (
        <MessageComponent key={index} index_main={index} message={message} />
      ))}
    </div>
  );
  


  // return (
  //   <div className="chat-box" ref={chatBoxRef} onScroll={handleScroll}>
  //     {messages.map((message, index) => (
  //       <div
  //         key={index}
  //         className={`message ${
  //           message.sender === "User" ? "user" : "bot"
  //         } ${theme}`}
  //       >
  //         <span className="message-sender">{message.sender}: </span>
  //         <div className="display-linebreak"> 
  //           {message.text.map((fragment, index) => (
  //               fragment.type === 'text' ? (
  //                   <p key={index}>{fragment.content}</p>
  //               ) : (
  //                 <CopyBlock
  //                   text={fragment.content}
  //                   language={fragment.lang}
  //                   showLineNumbers={true}
  //                   wrapLines
  //                 />
                    
  //               )
  //           ))}
  //         </div>
          
  //       </div>
  //     ))}
  //   </div>
  // );
}

export default ChatBox;
