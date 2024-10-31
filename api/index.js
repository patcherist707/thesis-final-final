import express from "express";
import dotenv from "dotenv";
import testRoutes from "./test-folder/test.route.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import {createServer} from 'node:http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {Server} from 'socket.io';
import setTempHumidDataListener from './data/temp.humid.js';

dotenv.config();
const app = express();
const port = 3000;
const httpServer = createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUSH"]
  }
});

app.use('/api', testRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res
  .status(statusCode)
  .json({
    success: false,
    statusCode,
    message,
  });
});

io.on('connection', (socket) => {

  // setUpRfidDataTagListener(io);
  
  // setMaxCapacityValueListener(io);
  // setUpRegisteredTagListener(io);
  // sendUnreadCountToFirebase(io);
  // testCode(io);
  // socket.on('fetchAllMessages', () => {
  //   getMessages(io);
  // });
  socket.on('joinRoom', ({ uid }) => {
    console.log(`User with UID ${uid} joined.`);
    setTempHumidDataListener(io, uid);
  });
  
  socket.on('disconnect', () => {
    console.log('Client Disconnected!');
  })
});

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
