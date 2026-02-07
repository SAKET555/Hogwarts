const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite default port
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

app.use('/api/users', require('./src/routes/authRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/messages', require('./src/routes/messageRoutes'));
app.use('/api/chat', require('./src/routes/chatRoutes'));

// Basic Route
app.get('/', (req, res) => {
  res.send('Hogwarts Express Server is Running!');
});

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('A wizard has connected:', socket.id);

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`Wizard ${socket.id} joined room: ${room}`);
  });

  socket.on('leave_room', (room) => {
    socket.leave(room);
    console.log(`Wizard ${socket.id} left room: ${room}`);
  });

  socket.on('send_message', (data) => {
    // data should contain { room, content, sender }
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('Wizard disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
