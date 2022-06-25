import express from "express";
import TeamControllers from "../controllers/team.controller.js";
import { validateTeamData } from "../middlewares/team.js";

const router = express.Router()

router.get('/all' , TeamControllers.getAllTeams.bind(TeamControllers))

router.get('/:teamName' , TeamControllers.getTeamByname.bind(TeamControllers))

router.post('/create' , validateTeamData , TeamControllers.createTeam)

router.post('/addProject/:teamName' , TeamControllers.addProject)

router.post('/inviteUser/:teamName' , TeamControllers.inviteUserToTeam)

router.patch('/:teamName' , validateTeamData , TeamControllers.updateTeam)

router.patch('/removeUser/:teamName' , TeamControllers.removeUserFromTeam)

router.delete('/:teamName' , TeamControllers.removeTeam)

export default router