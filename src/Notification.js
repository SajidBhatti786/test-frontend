// YourComponent.js
import React from "react";
import useSocket from "./useSocket";

const YourComponent = () => {
  const { handleLogin, handleSendFriendRequest, isLoggedIn } = useSocket();

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <p>Hello World</p>
      {isLoggedIn ? (
        <button onClick={handleSendFriendRequest}>Send Friend Request</button>
      ) : (
        <button onClick={handleLogin}>Log In</button>
      )}
    </div>
  );
};

export default YourComponent;
