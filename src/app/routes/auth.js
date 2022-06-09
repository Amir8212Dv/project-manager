import express from "express";
import AuthControllers from "../controllers/auth.controller.js";

const router = express.Router()

router.post('/signup' , AuthControllers.register)

router.post('/login')

export default router