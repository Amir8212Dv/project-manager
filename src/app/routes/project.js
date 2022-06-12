import express from "express";
import multer from "../middlewares/multer.js";
import ProjectControllers from "../controllers/project.controller.js";
import sortBodyData from "../middlewares/sortBodyData.js";
import { projectDeleteAccess, projectUpdateAccess } from "../middlewares/projectAccess.js";


const router = express.Router()

router.post('/' , ProjectControllers.createProject)

router.post('/image/:projectId' , projectUpdateAccess , multer.single('image') , ProjectControllers.uploadImage)

router.get('/:projectId' , ProjectControllers.getProjectById)

router.get('/:teamId' , ProjectControllers.getAllProjectOfTeam)

router.get('/allProjects' , ProjectControllers.getAllProjects)

router.get('/:userId' , ProjectControllers.getAllProjectOfUser)

router.patch('/:projectId' , projectUpdateAccess , sortBodyData , ProjectControllers.updateProject)

router.delete('/:projectId' , projectDeleteAccess , ProjectControllers.removeProject)



export default router