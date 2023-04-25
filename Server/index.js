const express = require('express');
const mongoose = require('mongoose');
const dotEnv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const messageRoutes = require("./routes/messagesRoutes");
const userRoutes = require("./routes/userRoutes");
const socket = require("socket.io");

//express app
dotEnv.config();
const app = express();

// middleware
mongoose.Promise = global.Promise;
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors())
app.use(cookieParser());
// Routes
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);



//connection
// MongoDB
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MONGO is Now Running');
}).catch((error) => {
    console.log('Error connecting to database: ' + error);
});
// Server
const server = app.listen(process.env.PORT, () => {
    console.log('Server Running on Port ${process.env.PORT}');
})



// socket.io
const io = socket(server, {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:5173"],
      credentials: true,
    },
  });
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        console.log("Received data:", data);
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
          socket.to(sendUserSocket).emit("msg-recieve", data.message);
        }
      });
    });