import React, { useState } from "react";
import useSocket from "./useSocket"; // Assuming useSocket is in the same directory
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [myToken, setMyToken] = useState("");
  // const [receiverEmail, setReceiverEmail] = useState("");
  const {
    handleLogin,
    handleSendFriendRequest,
    handleSendPrivateMessage,
    isLoggedIn,
  } = useSocket();
  const [reciverEmail, setReceiverEmail] = useState("");
  const [mydata, setMydata] = useState("");
  // const [receiverEmail, setReceiverEmail] = useState("");

  const sendFriendRequest = async () => {
    try {
      const response = await fetch(
        "http://3.144.244.10:3000/api/user/friend-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: myToken,
          },
          body: JSON.stringify({ receiverEmail: reciverEmail }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const data = await response.json();
      console.log("Friend request sent successfully:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle errors here
      return null;
    }
  };
  const sendPrivateMessage = async () => {
    try {
      const data = {
        receiverId: reciverEmail,
        content: "Hello, this is a private message!",
      };

      const response = await fetch(
        "http://3.144.244.10:3000/api/user/send-message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: myToken,
            // Add any other required headers (e.g., authorization token)
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const result = await response.json();
      console.log("Message sent successfully:", result);
      // Handle the success response here
    } catch (error) {
      console.error("Error sending message:", error.message);
      // Handle the error here
    }
  };
  const handleSendMessage = async () => {
    try {
      // Assuming receiver's email is set somewhere, replace 'receiverEmail' with the actual receiver's email
      await handleSendPrivateMessage(
        "sajid@gmail.com",
        "Hello, this is a private message!"
      );
    } catch (error) {
      console.error("Error sending private message:", error.message);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform login actions using the provided username and password
    try {
      // Replace this with your actual login API endpoint
      const response = await fetch("http://3.144.244.10:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      // Assuming the response includes a token property
      const res = await response.json();
      let token = res.data;
      setMyToken(token);

      // Use the received token to authenticate the socket connection
      handleLogin(token);

      // Reset username and password fields after successful login
      // setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Login error:", error.message);
      // Handle login error or display an error message to the user
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <h3>Username: {username}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>

      {isLoggedIn && (
        <div>
          <div>
            <label htmlFor="receiverEmail">Receiver's Email:</label>
            <input
              type="text"
              id="receiverEmail"
              placeholder="Enter receiver's email"
              value={reciverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
            />
          </div>
          <button onClick={sendPrivateMessage}>Send Message</button>
          <button onClick={handleSendMessage}>Send Private Message</button>
          <button onClick={sendFriendRequest}>Send Friend Request</button>
        </div>
      )}

      {mydata && <h1>Its me: {mydata}</h1>}
      <ToastContainer />
    </div>
  );
};

export default Login;
