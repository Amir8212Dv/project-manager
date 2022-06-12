import express from 'express'
import userRouter from './user.js'
import projectRouter from './project.js'
import teamRouter from './team.js'
import authRouter from './auth.js'
import checkAuthToken from '../middlewares/checkAuthToken.js'

const router = express.Router()

router.use('/user' , checkAuthToken , userRouter)
router.use('/project' , checkAuthToken , projectRouter)
router.use('/team' , checkAuthToken , teamRouter)
router.use('/auth' , authRouter)

export default router