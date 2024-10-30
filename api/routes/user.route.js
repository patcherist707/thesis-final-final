import express from "express";
import { tokenVerification } from "../utility/user.verification.js";
import { updateuser } from "../controller/user.controller.js";

const router = express.Router();

router.put('/update/:userId', tokenVerification, updateuser);

export default router;
