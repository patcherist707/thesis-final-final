import express from "express";
import dotenv from "dotenv";
import testRoutes from "./test-folder/test.route.js";
import {createServer} from 'node:http';

dotenv.config();
const app = express();
const port = 3000;
const httpServer = createServer(app);

app.use(express.json());
app.use('/api', testRoutes);


httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
