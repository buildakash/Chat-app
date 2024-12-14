// const express = require('express');
//change package.json from type to module (default commonjs)
import express from "express";
import authRoute from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/message.router.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";

dotenv.config();


const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRouter);

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))
    app.get("*",(req,res) => {
        res.sendFile(__dirname,"../frontend","dist","index.html")
    })
}

server.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})
