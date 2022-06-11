import teamModel from "../models/team.js"
import userModel from "../models/user.js"

class TeamControllers {
    async createTeam(req , res , next) {
        try {
            const team = await teamModel.create({...req.body , owner : req.userId , members : [req.userId]})
            console.log('team')
            const user = await userModel.findByIdAndUpdate(req.userId , {$addToSet : {team: team._id}})
            console.log('user')
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
            
            res.status().send({
                status : 20,
                success : true
            })
        } catch (error) {
            next(error)
        }
    }
    async getTeamById(req , res , next) {
        try {
            
            res.status().send({
                status : 20,
                success : true
            })
        } catch (error) {
            next(error)
        }
    }
    async inviteUserToTeam(req , res , next) {
        try {
            
            res.status().send({
                status : 20,
                success : true
            })
        } catch (error) {
            next(error)
        }
    }
    async removeUserFromTeam(req , res , next) {
        try {
            
            res.status().send({
                status : 20,
                success : true
            })
        } catch (error) {
            next(error)
        }
    }
    async updateTeam(req , res , next) {
        try {
            
            res.status().send({
                status : 20,
                success : true
            })
        } catch (error) {
            next(error)
        }    
    }
    async removeTeam(req , res , next) {
        try {
            
            res.status().send({
                status : 20,
                success : true
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new TeamControllers()