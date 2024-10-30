import express from "express";
import { tokenVerification } from "../utility/user.verification.js";
import { deleteuser, updateuser, signout } from "../controller/user.controller.js";

const router = express.Router();

router.put('/update/:userId', tokenVerification, updateuser);
router.put('/delete/:userId', tokenVerification, deleteuser);
router.post('/signout', signout);

export default router;
