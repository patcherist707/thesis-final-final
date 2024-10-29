import express from "express";
import dotenv from "dotenv";
import testRoutes from "./test-folder/test.route.js";
import userRoutes from "./routes/auth.route.js";
import {createServer} from 'node:http';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
const port = 3000;
const httpServer = createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use('/api', testRoutes);
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

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
