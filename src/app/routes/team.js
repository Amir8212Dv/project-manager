import express from "express";
import TeamControllers from "../controllers/team.controller.js";
import checkAuthToken from '../middlewares/checkAuthToken.js'
import sortBodyData from "../middlewares/sortBodyData.js";
import deleteTeamAccess from "../middlewares/teamAccess.js";

const router = express.Router()

router.post('/' , TeamControllers.createTeam)

router.post('/addProject/:teamid' , TeamControllers.addProject)

router.delete('/' , deleteTeamAccess , TeamControllers.removeTeam)

router.get('/all' , TeamControllers.getAllTeams)

router.get('/:teamId' , TeamControllers.getTeamById)

router.patch('/:teamId' , sortBodyData , TeamControllers.updateTeam)

router.patch('/removeUser/:teamId' , TeamControllers.removeUserFromTeam)

router.post('/inviteUser/:teamId' , TeamControllers.inviteUserToTeam)

export default router