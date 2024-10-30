import express from "express";
import { tokenVerification } from "../utility/user.verification.js";
import { deleteuser, updateuser } from "../controller/user.controller.js";

const router = express.Router();

router.put('/update/:userId', tokenVerification, updateuser);
router.put('/delete/:userId', tokenVerification, deleteuser);

export default router;
