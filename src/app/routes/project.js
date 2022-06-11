import express from "express";
import multer from "../middlewares/multer.js";
import ProjectControllers from "../controllers/project.controller.js";
import sortBodyData from "../middlewares/sortBodyData.js";


const router = express.Router()

router.post('/' , ProjectControllers.createProject)

router.post('/image/:projectId' , multer.single('image') , ProjectControllers.uploadImage)

router.get('/projectById' , ProjectControllers.getProjectById)

router.get('/projectOfTeam' , ProjectControllers.getAllProjectOfTeam)

router.get('/allProjects' , ProjectControllers.getAllProjects)

router.get('/projectsOfUser' , ProjectControllers.getAllProjectOfUser)

router.patch('/:projectId' , sortBodyData , ProjectControllers.updateProject)

router.delete('/:projectId' , ProjectControllers.removeProject)



export default router