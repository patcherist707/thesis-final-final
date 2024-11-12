import express from 'express';
import { tokenVerification } from '../utility/user.verification.js';
import { capacity } from '../controller/data.controller.js';

const router = express.Router();

router.post('/capacity/:userId', tokenVerification, capacity);

export default router;