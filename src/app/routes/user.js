import express from "express";
import multer from '../middlewares/multer.js'
import UserControllers from "../controllers/user.controller.js";
import sortBodyData from "../middlewares/sortBodyData.js";
import validateUserData from "../middlewares/validateUserData.js";

const router = express.Router()

router.get('/' , UserControllers.getProfile)

router.get('/inviteRequests' , UserControllers.getInviteRequests)

router.patch('/profile'  , validateUserData , sortBodyData , UserControllers.updateProfile)

router.post('/avatar' , multer.single('image') , UserControllers.uploadAvatar )

router.post('/skills' , UserControllers.addSkills)

router.post('/acceptInviteToTeam/:inviteId' , UserControllers.acceptInviteToTeam)

router.post('/rejectInviteToTeam/:inviteId' , UserControllers.rejectInviteToTeam)

router.delete('/skills' , UserControllers.removeSkills)

router.delete('/' , UserControllers.deleteUser)



export default router