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

app.use(cookieParser());
// Routes
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);


// Add CORS headers middleware function
app.use(cors({
  origin: ['https://my-chat-ldlavbet3-jceroma23.vercel.app/',
   'https://my-chat-app-plum.vercel.app/',
   'https://my-chat-app-git-main-jceroma23.vercel.app/',
   'https://my-chat-ldlavbet3-jceroma23.vercel.app/'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors({
  origin: ['https://my-chat-ldlavbet3-jceroma23.vercel.app/',
   'https://my-chat-app-plum.vercel.app/',
   'https://my-chat-app-git-main-jceroma23.vercel.app/',
   'https://my-chat-ldlavbet3-jceroma23.vercel.app/'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


// Add the allowCors middleware function here
const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

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

app.use(allowCors);

// socket.io
const io = socket(server, {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:5173" ],
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