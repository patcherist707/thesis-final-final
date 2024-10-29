import express from "express";
import { testDatabase, test } from "./test.controller.js";

const router = express.Router();

router.get('/test', test);
router.post('/testDatabase', testDatabase);

export default router;
