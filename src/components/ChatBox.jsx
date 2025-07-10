// components/ChatBox.jsx
import React from "react";

  const ChatBox = ({ type, children }) => {
    return (
      <div className={`flex ${type === "user" ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-[80%] px-4 py-3 rounded-xl ${
            type === "user" ? "bg-[#10a37f] text-white" : "bg-[#444654] text-white"
          }`}
        >
          {children}
        </div>
      </div>
    );
  };

  export default ChatBox;


