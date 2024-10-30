import express from "express";
import { authUser, signin, signup } from "../controller/auth.controller.js";

const router = express.Router();

router.post('/user/signup', signup);
router.post('/user/signin', signin);
router.post('/user/authUser', authUser);

export default router;