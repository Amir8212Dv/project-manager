import express from "express";
import AuthControllers from "../controllers/auth.controller.js";
import checkAuthToken from "../middlewares/checkAuthToken.js";
import validateUserData from "../validation/validateUserData.js";

const router = express.Router()

router.post('/signup' , validateUserData , AuthControllers.register)

router.post('/login' , AuthControllers.login)

router.post('/resetpassword', checkAuthToken , validateUserData , AuthControllers.resetPassword)

router.post('/logout' , checkAuthToken , AuthControllers.logout)

export default router