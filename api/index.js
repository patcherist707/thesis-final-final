import express from "express";
import dotenv from "dotenv";
import testRoutes from "./test-folder/test.route.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import {createServer} from 'node:http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {Server} from 'socket.io';
import {setTempHumidDataListener, logTempHumidData} from './data/temp.humid.js';
import cron from "node-cron";
import { setMaxCapacityValueListener, setUpRfidDataTagListener, setUpTagInformationListener } from "./data/rfidData.js";
import maxValueCapacityRoutes from './routes/data.route.js';

dotenv.config();
const app = express();
const port = 3000;
const httpServer = createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(cors());

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUSH"]
  }
});

app.use('/api', testRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', maxValueCapacityRoutes);
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

// cron.schedule('* * * * *', () => {
//   logTempHumidData();
// });

io.on('connection', (socket) => {

  socket.on('joinRoom', ({ uid }) => {
    // console.log(`User with UID ${uid} joined.`);
    console.log('Client Connected!');
    setTempHumidDataListener(io, uid);
    setUpRfidDataTagListener(io, uid);
    setUpTagInformationListener(io, uid);
    setMaxCapacityValueListener(io, uid);
  });
  
  socket.on('disconnect', () => {
    console.log('Client Disconnected!');
  })
});

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
