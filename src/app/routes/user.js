import express from "express";
import multer from '../middlewares/multer.js'
import UserControllers from "../controllers/user.controller.js";
import { validateUserData } from "../middlewares/user.js";

const router = express.Router()

router.get('/profile' , UserControllers.getMyProfile.bind(UserControllers))

router.get('/inviteRequests' , UserControllers.getInviteRequests.bind(UserControllers))

router.patch('/updateProfile' , validateUserData , UserControllers.updateProfile)

router.patch('/addSkills' ,validateUserData , UserControllers.addSkills)

router.patch('/removeSkills' ,validateUserData , UserControllers.removeSkills)

router.post('/avatar' , multer.single('image') , UserControllers.uploadAvatar )

router.post('/acceptInviteToTeam/:inviteId' , UserControllers.acceptInviteToTeam)

router.post('/rejectInviteToTeam/:inviteId' , UserControllers.rejectInviteToTeam)

router.delete('/deleteAccount' , UserControllers.deleteUser)



export default router