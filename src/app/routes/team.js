import express from "express";
import TeamControllers from "../controllers/team.controller.js";
import checkAuthToken from '../middlewares/checkAuthToken.js'

const router = express.Router()

router.post('/' , checkAuthToken , TeamControllers.createTeam)

export default router