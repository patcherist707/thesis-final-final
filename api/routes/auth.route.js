import express from "express";
import { signin, signup } from "../controller/auth.controller.js";

const router = express.Router();

router.post('/user/signup', signup);
router.post('/user/signin', signin);

export default router;