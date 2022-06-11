import express from "express";
import multer from '../middlewares/multer.js'
import UserControllers from "../controllers/user.controller.js";
import sortBodyData from "../middlewares/sortBodyData.js";
import validateUserData from "../validation/validateUserData.js";

const router = express.Router()

router.get('/' , UserControllers.getProfile)

router.patch('/profile'  , validateUserData , sortBodyData , UserControllers.updateProfile)

router.post('/avatar' , multer.single('image') , UserControllers.uploadAvatar )

router.post('/skills' , UserControllers.addSkills)

router.delete('/skills' , UserControllers.removeSkills)

router.post('/acceptInviteToTeam' , UserControllers.acceptInviteToTeam)

router.post('/rejectInviteToTeam' , UserControllers.rejectInviteToTeam)


export default router