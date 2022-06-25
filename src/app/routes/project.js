import express from "express";
import multer from "../middlewares/multer.js";
import ProjectControllers from "../controllers/project.controller.js";
import { validateProjectData } from "../middlewares/project.js";

const router = express.Router()

router.get('/allProjects' , ProjectControllers.getAllProjects.bind(ProjectControllers))

router.get('/:projectName' , ProjectControllers.getProjectByName.bind(ProjectControllers))

router.post('/createProject' ,validateProjectData , ProjectControllers.createProject)

router.post('/image/:projectName' , multer.single('image') , ProjectControllers.uploadImage)

router.patch('/updateProject/:projectName' , validateProjectData , ProjectControllers.updateProject)

router.delete('/deleteProject/:projectName' , ProjectControllers.removeProject)



export default router