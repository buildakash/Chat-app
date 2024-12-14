import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getResponseSocketId, io } from "../lib/socket.js";

export const getUsersforSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json({ filteredUsers });
  } catch (err) {
    console.log("Error in getUserforSidebar", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: userChatId } = req.params;
    const myId = req.user._id;

    const message = await Message.find({
      $or: [
        { senderId: myId, receiverId: userChatId },
        { senderId: userChatId, receiverId: myId },
      ],
    });

    res.status(200).json(message);
  } catch (err) {
    console.log("Error in getMessage", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageurl;

    if (image) {
      const uploadImage = await cloudinary.uploader.upload(image);
      imageurl = uploadImage.secure_url;
    }

    const newMessage = new Message({
      text,
      image: imageurl,
      senderId,
      receiverId,
    });

    await newMessage.save();

    // socket.io
    const recieverSocketId = getResponseSocketId(receiverId);
    if(recieverSocketId) {
      io.to(recieverSocketId).emit("newMessage",newMessage)
    }

    res.status(201).json(newMessage);
  } catch (err) {
    console.log("Error in Send Message", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
