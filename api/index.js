import express from "express";
import dotenv from "dotenv";
import testRoutes from "./test-folder/test.route.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import {createServer} from 'node:http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {Server} from 'socket.io';
import {setTempHumidDataListener, fetchTempHumidEvery10Minute} from './data/temp.humid.js';
import cron from "node-cron";
import { setMaxCapacityValueListener, setUpRfidDataTagListener, setUpTagInformationListener } from "./data/rfidData.js";
import maxValueCapacityRoutes from './routes/data.route.js';
import { monthlyInventoryTest, philippineTimeCheck, realtimeNotificationTest, tempHumidReadingTest } from "./test-folder/test.controller.js";
import { rfidInFlowMessage, rfidoutFlowMessage } from "./notificattions/rfid.notification.js";
import { rfidThresholdAlert } from "./Alerts/rfid.alerts.js";

dotenv.config();
const app = express();
const port = 3000;
const httpServer = createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// const io = new Server(httpServer, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST", "DELETE", "PUSH"]
//   }
// });

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      const allowedOrigin = /^http:\/\/localhost:\d+$/;

      if (origin && allowedOrigin.test(origin)) {
        callback(null, true); 
      } else {
        callback(new Error("Not allowed by CORS")); 
      }
    },
    methods: ["GET", "POST", "DELETE", "PUT"], 
  },
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

cron.schedule('*/10 * * * *', () => {
  fetchTempHumidEvery10Minute();
});

// cron.schedule('* * * * *', () => {
//   philippineTimeCheck()
// });

// monthlyInventoryTest();
// tempHumidReadingTest();
// realtimeNotificationTest();
// rfidInFlowMessage();
// rfidoutFlowMessage();

cron.schedule('0 23 * * *', () => {
  rfidInFlowMessage();
  rfidoutFlowMessage();
});



// io.on('connection', (socket) => {

//   rfidThresholdAlert(io);

//   socket.on('joinRoom', ({ uid }) => {
//     // console.log(`User with UID ${uid} joined.`);
//     console.log('Client Connected!');
//     setTempHumidDataListener(io, uid);
//     setUpRfidDataTagListener(io, uid);
//     setUpTagInformationListener(io, uid);
//     setMaxCapacityValueListener(io, uid);
//   });
  
//   socket.on('disconnect', () => {
//     console.log('Client Disconnected!');
//   })
// });

io.on('connection', (socket) => {

  rfidThresholdAlert(io);

  socket.on('joinRoom', ({ uid }) => {
    console.log(`User with UID ${uid} joined.`);
    socket.join(uid);
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
