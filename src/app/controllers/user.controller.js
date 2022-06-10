import mongoose from "mongoose"
import userModel from "../models/user.js"

class UserControllers {
    async getProfile(req , res , next) {
        try {
            const user = await userModel.findById(req.userId , {__v : 0 , password : 0 , token : 0 })
            res.send({
                status : 200,
                success : true,
                user
            })
        } catch (error) {
            next(error)
        }
    }
    async updateProfile(req , res , next) {
        try {
            const user = await userModel.findByIdAndUpdate(req.userId , req.updateData , {returnDocument : 'after'})
            res.send({
                status : 200,
                success : true,
                user
            })

        } catch (error) {
            next(error)
        }
    }
    async addSkills(req , res , next) {
        try {
            const user = await userModel.findById(req.userId)
            req.body.map(newSkill => !user.skills.includes(newSkill) && user.skills.push(newSkill))
            await user.save()
            res.send({
                status : 200,
                success : true,
                skills : user.skills
            })
        } catch (error) {
            next(error)
        }
    }
    async removeSkills(req , res , next) {
        try {
            const user = await userModel.findById(req.userId)
            user.skills = user.skills.filter(skill => !req.body.includes(skill))
            await user.save()
            res.send({
                status : 200,
                success : true,
                skills : user.skills
            })
        } catch (error) {
            next(error)
        }
    }
    async acceptInviteToTeam(req , res , next) {
        try {
            const user = await userModel.findByIdAndUpdate(req.userId , {$addToSet : {team : req.body.teamId}} , {returnDocument : 'after'})
            res.send({
                status : 200,
                success : true , 
                teams : user.team
            })
        } catch (error) {
            next(error)
        }
    }
    async rejectInviteToTeam(req , res , next) {
        try {
            
        } catch (error) {
            next(error)
        }
    }
}

export default new UserControllers()