import React from "react";

const ChatBubble = ({ message, role }) => {
  // Define common styles for the chat bubble
  const bubbleStyles = {
    position: "relative",
    margin: "10px",
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "70%",
    color: "white",
    backgroundColor: role === "user" ? "#6200b3" : "#4B5563",
    alignSelf: role === "user" ? "flex-end" : "flex-start",
  };

  // Define the triangle styles based on the role (user or AI)
  const triangleStyles = {
    content: "''",
    position: "absolute",
    bottom: "-10px",
    borderWidth: "10px",
    borderStyle: "solid",
    borderColor:
      role === "user"
        ? "transparent #6200b3 transparent transparent"
        : "transparent transparent transparent #4B5563",
    [role === "user" ? "right" : "left"]: "0px",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={bubbleStyles}>
        <span style={{ position: "absolute", ...triangleStyles }} />
        {message}
      </div>
    </div>
  );
};

export default ChatBubble;
