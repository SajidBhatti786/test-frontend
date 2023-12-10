import { useEffect, useState } from "react";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useSocket = () => {
  const [token, setToken] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [senderEmail, setSenderEmail] = useState(null);
  const [receiverEmail, setReceiverEmail] = useState(null);
  useEffect(() => {
    const newSocket = io("wss://h2-o-backend-2zkv.vercel.app/");

    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    // newSocket.on("friendRequestSent", ({ senderEmail, friendshipId }) => {
    //   console.log("Friend request sent");
    //   // Handle success or error notification
    // });
    newSocket.emit("sendFriendRequest", {
      senderEmail,
      receiverEmail,
    });

    newSocket.on("friendRequestSent", ({ success, message }) => {
      if (success) {
        console.log("Friend request sent successfully");
        // Handle success notification or update UI
      } else {
        console.error("Error sending friend request:", message);
        // Handle error notification or update UI
      }
    });
    newSocket.on("private message", (data) => {
      console.log(
        `Received private message from ${data.from}: ${data.message}`
      );
    });
    newSocket.on("friendRequest", (data) => {
      console.log(
        `Received private message from ${data.from}:  from: ${data.data.sender} to: ${data.data.receiver}`
      );
    });

    newSocket.on("getOnlineUsers", (user) => {
      console.log(user.full_name + " connected to the server!");
    });

    newSocket.on("getOfflineUsers", (user) => {
      console.log(user.full_name + " disconnected from the server!");
      setSocket(newSocket);
    });
    newSocket.on("friendRequest", ({ senderEmail, receiverEmail }) => {
      console.log(
        "Friend request received from " + senderEmail + " to " + receiverEmail
      );
      // Handle success or error notification
      // newSocket.on("privateMessageSent", (sender, receiver, message) => {
      //   console.log(
      //     "Private message sent successfully from " + sender + " to " + receiver
      //   );
      //   // Handle success notification or update UI
      //   console.log("Private message sent successfully");
      //   // Handle success notification or update UI
      // });
    });
    // const sendPrivateMessage = (receiverEmail, message = "hello") => {
    //   let msg = "hello";
    //   if (newSocket && senderEmail && receiverEmail) {
    //     newSocket.emit("sendPrivateMessage", {
    //       senderId: senderEmail,
    //       receiverId: receiverEmail,
    //       message: msg,
    //     });
    //   } else {
    //     console.error("Socket or senderId or receiverId is not available.");
    //   }
    // };
    // newSocket.emit("sendPrivateMessage", {
    //   senderId: senderEmail,
    //   receiverId: receiverEmail,
    //   message: message,
    // });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleLogin = (token) => {
    setIsLoggedIn(true);
    setToken(token);
    let sock = io("https://h2-o-backend-2zkv.vercel.app/", {
      query: {
        token: token,
      },
    });
    setSocket(sock);
  };
  const sendPrivateMessage = (message = "hello") => {
    let receiverEmail = "noor@gmail.com";
    let senderEmail = "sajid@gmail.com";
    let msg = "hi";

    if (socket && senderEmail && receiverEmail) {
      socket.emit("sendPrivateMessage", {
        senderId: senderEmail,
        receiverId: receiverEmail,
        message: msg,
      });
    } else {
      console.error("Socket or senderId or receiverId is not available.");
    }
  };

  useEffect(() => {
    if (socket) {
      console.log("reRendering");
      socket.on("privateMessageSent", (data) => {
        console.log("ReRending");
        console.log("Private message sent:", data);
        // Handle the received data or update UI accordingly
        toast.success(`Message: ${data.message} Sender: ${data.sender}`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
      socket.on("privateMessageReceived", (data) => {
        console.log("Private message received:", data);
        // Handle the received data or update UI accordingly
      });
    }
  }, [socket]);
  const handleSendPrivateMessage = (message = "hello") => {
    sendPrivateMessage(message);
  };

  const handleSendFriendRequest = async (receiverEmail) => {
    try {
      const response = await fetch(
        "https://h2-o-backend-2zkv.vercel.app/api/user/getUserData",
        {
          method: "GET",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const userData = await response.json();
      console.log("User Data:", userData.user);
      setSenderEmail(userData.user);
      setReceiverEmail(receiverEmail);
      if (socket) {
        // const receiverRoom = `receiver-${receiverEmail}`;
        // socket.emit("joinRoom", receiverRoom);
        socket.emit("sendFriendRequest", {
          senderEmail: userData.user.email,
          receiverEmail: receiverEmail,
          token: token,
        });
      }

      return userData; // Return or further process the user data as needed
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      // Handle the error scenario appropriately
    }
  };

  return {
    handleLogin,
    handleSendFriendRequest,
    isLoggedIn,
    handleSendPrivateMessage,
    sendPrivateMessage,
  };
};

export default useSocket;
