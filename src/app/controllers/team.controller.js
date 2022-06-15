import mongoose from "mongoose"
import projectModel from "../models/project.js"
import teamModel from "../models/team.js"
import userModel from "../models/user.js"

class TeamControllers {
    async createTeam(req , res , next) { // completed
        try {
            const team = await teamModel.create({...req.teamData , owner : req.userId , members : [req.userId]})
            const user = await userModel.updateOne({_id : req.userId} , {$addToSet : {team: team._id}})
            console.log(user)
            res.status(201).send({
                status : 201,
                success : true,
                team : team
            })
        } catch (error) {
            next(error)
        }
    }
    async getAllTeams(req , res , next) {
        try {
            
            const teams = await teamModel.find({owner : userId})
            res.status().send({
                status : 20,
                success : true,
                teams
            })
        } catch (error) {
            next(error)
        }
    }
    async getTeamByIdOrName(req , res , next) {
        try {
            const searchTeamBy = mongoose.isValidObjectId(req.params.teamId) ? {_id : req.params.teamId} : {name : req.params.teamId}
            const team = await teamModel.find(searchTeamBy)
            
            if(!team) throw {message : `there is not team with this data`}
            res.status().send({
                status : 20,
                success : true,
                team
            })
        } catch (error) {
            next(error)
        }
    }
    async inviteUserToTeam(req , res , next) {
        try {
            
            const team = await teamModel.findById(req.params.teamId)
            if(team.owner !== req.userId) throw {message : 'access denied' , status : 400}

            res.status(200).send({
                status : 200,
                success : true
            })
        } catch (error) {
            next(error)
        }
    }
    async removeUserFromTeam(req , res , next) { // completed
        try {
            const team = await teamModel.findOne({owner : req.userId , _id : req.params.teamId})
            
            if(!team) throw {message : 'there is no team with this id' , status : 400}
            if(team.owner.toString() === req.body.userId) throw {message : "owner can't be removed from team" , status : 400}
            
            team.members = team.members.filter(member => member.toString() !== req.body.userId)
            await team.save()

            const user = await userModel.updateOne({_id : req.body.userId} , {$pull : {team : req.params.teamId}})
            if(!user.matchedCount) throw {message : 'there is no user with this id' , status : 400}
            
            res.status(200).send({
                status : 200,
                success : true,
                message : 'user removed from team successfully'
            })
        } catch (error) {
            next(error)
        }
    }
    async updateTeam(req , res , next) { // completed
        try {

            const team = await teamModel.findOneAndUpdate(
                {$and : [{_id : req.params.teamId} , {$or : [{owner : req.userId} , {members : req.userId}]}]} ,
                req.teamData ,
                {returnDocument : 'after'}
            )

            if (!team) throw {message : 'update team faild' , status : 400}
            
            res.status(200).send({
                status : 200,
                success : true,
                team
            })
        } catch (error) {
            next(error)
        }    
    }
    async removeTeam(req , res , next) { // completed
        try {
            
            const deletedTeam = await teamModel.findByIdAndDelete(req.params.teamId)
            const deleteProjects = await projectModel.deleteMany({team : req.params.teamId})

            const deleteFromUser = await userModel.updateOne({_id : req.userId} , {$pull : {team : req.params.teamId}})

            res.status(200).send({
                status : 200,
                success : true,
                deletedTeam
            })
        } catch (error) {
            next(error)
        }
    }
    async addProject(req, res , next) { // add a new path in project (accept to add into a team)
        try {
            const project = await projectModel.updateOne({_id : req.body.projectId} , {team : req.params.teamid})
            const team = await teamModel.updateOne({_id : req.params.teamid} , {$addToSet : {projects : req.body.projectId}})

            res.status(201).send({
                status : 201,
                success : true,
                message : 'project added to team success fully'
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new TeamControllers()