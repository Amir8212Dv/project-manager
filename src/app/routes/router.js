import express from 'express'
import userRouter from './user.js'
import projectRouter from './project.js'
import teamRouter from './team.js'
import authRouter from './auth.js'

const router = express.Router()

router.use('/user' , userRouter)
router.use('/project' , projectRouter)
router.use('/team' , teamRouter)
router.use('/auth' , authRouter)

export default router