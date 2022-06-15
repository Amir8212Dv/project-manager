import express from "express";
import TeamControllers from "../controllers/team.controller.js";
import { validateData } from "../middlewares/team.js";
import deleteTeamAccess from "../middlewares/teamAccess.js";

const router = express.Router()

router.post('/create' , validateData , TeamControllers.createTeam)

router.post('/addProject/:teamid' , TeamControllers.addProject)

router.delete('/' , deleteTeamAccess , TeamControllers.removeTeam)

router.get('/all' , TeamControllers.getAllTeams)

router.get('/:teamId' , TeamControllers.getTeamByIdOrName)

router.patch('/:teamId' , validateData , TeamControllers.updateTeam)

router.patch('/removeUser/:teamId' , TeamControllers.removeUserFromTeam)

router.post('/inviteUser/:teamId' , TeamControllers.inviteUserToTeam)

export default router