import express from "express";
import UserControllers from "../controllers/user.controller.js";
import sortUpdateUserData from "../middlewares/sortUpdateUserData.js";
import validateUserData from "../validation/validateUserData.js";

const router = express.Router()

router.get('/profile' , UserControllers.getProfile)

router.patch('/profile'  , validateUserData , sortUpdateUserData , UserControllers.updateProfile)

router.post('/skills' , UserControllers.addSkills)

router.delete('/skills' , UserControllers.removeSkills)

router.post('/acceptInviteToTeam' , UserControllers.acceptInviteToTeam)

router.post('/rejectInviteToTeam' , UserControllers.rejectInviteToTeam)


export default router