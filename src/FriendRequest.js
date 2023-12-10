import React, { useEffect } from "react";
import io from "socket.io-client";

const FriendRequestComponent = () => {
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("friendRequest", async ({ senderEmail, friendshipId }) => {
      try {
        console.log("Received friend request from:", senderEmail);
        console.log("Friendship ID:", friendshipId);
        // Handle the received friend request notification
        // Update UI or trigger necessary actions
      } catch (error) {
        console.error("Error processing friend request:", error.message);
      }
    });
    socket.on("friendRequestSent", async () => {
      console.log("Friend request sent");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendFriendRequest = (senderEmail, receiverEmail, token) => {
    const socket = io("http://localhost:5000"); // Create a new socket instance
    socket.emit("sendFriendRequest", { senderEmail, receiverEmail, token });
  };

  const handleFriendRequest = () => {
    // Replace the following details with actual senderEmail, receiverEmail, and token
    const senderEmail = "sajid@gmail.com";
    const receiverEmail = "noor@gmail.com";
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1Njc3N2Y5NTQ2OTFmMTE3YTkwZjBlYiIsInVzZXJuYW1lIjoic2FqaWRAZ21haWwuY29tIiwiaWF0IjoxNzAxMjgxMDk5fQ.AZniYYrkqfOE5P8EKf5ht3f4ZLVV4MKTSJbF4Xv-VpU";

    sendFriendRequest(senderEmail, receiverEmail, token);
  };

  return (
    <div>
      <button onClick={handleFriendRequest}>Send Friend Request</button>
      {/* Additional UI elements */}
    </div>
  );
};

export default FriendRequestComponent;
