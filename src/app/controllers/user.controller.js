import path from 'path'
import projectModel from '../models/project.js'
import teamModel from '../models/team.js'
import userModel from "../models/user.js"
import fs from 'fs'
import createImageLink from '../../utils/createImageLink.js'


class UserControllers {
    #aggregatePipeline = [
        {
            $lookup : {
                from : 'teams',
                localField : 'teams',
                foreignField : 'name',
                as : 'teams'
            }
        },
        {
            $lookup : {
                from : 'projects',
                localField : 'projects',
                foreignField : 'name',
                as : 'projects'
            }
        },
        {
            $project : {
                __v : 0,
                password : 0,
                token : 0,
                'teams.__v' : 0,
                'projects.__v' : 0
            }
        }
    ]
    async getMyProfile(req , res , next) {
        try {
            const [user] = await userModel.aggregate([
                {
                    $match : {
                        username : req.username
                    }
                },
                ...this.#aggregatePipeline
            ])

            res.send({
                status : 200,
                success : true,
                user : user
            })
        } catch (error) {
            next(error)
        }
    }
    async getUserByUsername(req , res , next) {
        try {
            const [user] = await userModel.aggregate([
                {
                    $match : {
                        username : req.params.username
                    }
                },
                ...this.#aggregatePipeline
            ])
            if(!user) throw {message : 'user not found' , status : 400}

            res.send({
                status : 200,
                success : true,
                user
            })
        } catch (error) {
            next(error)
        }
    }

    async uploadAvatar(req , res , next) {
        try {  
            const user = await userModel.findByIdAndUpdate(req.userId , {avatar : path.join('images' , req.file.filename)} , {returnDocument : 'after'})
    
            if(!user) throw {message : 'upload avatar faild' , status : 500}
            res.status(201).send({
                status : 201,
                success : true,
                images : createImageLink(req , user.avatar)
            })
            
        } catch (error) {
            next(error)
        }
    }
    async updateProfile(req , res , next) {
        try {
            const user = await userModel.updateOne({_id : req.userId} , req.userData , {returnDocument : 'after'})
            
            res.send({
                status : 200,
                success : true,
                message : 'profile updated successfully',
            })

        } catch (error) {
            // if(error?.code === 11000) return next({message : `entered ${Object.keys(error.keyValue)[0]} already exists` , status : 400})
            next(error)
        }
    }
    async addSkills(req , res , next) {
        try {
            const user = await userModel.findById(req.userId)
            req.userData.skills.forEach(newSkill => !user.skills.includes(newSkill) && user.skills.push(newSkill))
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
            const user = await userModel.findByIdAndUpdate(req.userId)
            user.skills = user.skills.filter(skill => !req.userData.skills.includes(skill))
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
    async deleteUser(req , res , next) {
        try {
            const deletedUser = await userModel.findByIdAndDelete(req.userId)

            const deleteTeams = await teamModel.find({owner : req.username})
            await teamModel.deleteMany({owner : req.username})
            deleteTeams.forEach(async team => {
                await userModel.updateMany({teams : team.name} , {$pull : {teams : team.name}})
            })
            const deleteProjects = await projectModel.find({owner : req.username})
            await projectModel.deleteMany({owner : req.username})

            const deleteFromTeamMembers = await teamModel.updateMany({members : req.username} , {$pull : {members : req.username}})

            if(deletedUser.avatar) fs.unlinkSync(path.join(process.argv[1] , '..' , '..' , 'public' , deletedUser.avatar))
            deleteProjects.map(project => {
                if(project.image) fs.unlinkSync(path.join(process.argv[1] , '..' , '..' , 'public' , project.image))
            })

            res.send({
                status : 200,
                success : true,
                deletedUser
            })
        } catch (error) {
            next(error)
        }
    }

    async acceptInviteToTeam(req , res , next) {
        try {
            
            const user = await userModel.findOne({username : req.username ,'inviteRequests._id' : req.params.inviteId })
            if(!user) throw {message : 'request not found' , status : 400}

            await user.inviteRequests.forEach(async request => {
                if(request._id.toString() === req.params.inviteId) {
                    if(request.status !== 'PENDING') throw {message : 'this invite already checked' , status :400}
                    request.status = 'ACCEPTED'
                    const team = await teamModel.findOneAndUpdate({name : request.teamName} , {$addToSet : {members : req.username}})
                    user.teams.push(request.teamName)
                    await user.save()
                }
            })

            res.send({
                status : 200,
                success : true , 
                message : 'you joined team successfully'
            })
        } catch (error) {
            next(error)
        }
    }
    async rejectInviteToTeam(req , res , next) {
        try {
            const user = await userModel.findOne({username : req.username , 'inviteRequests._id': req.params.inviteId})
            if(!user) throw {message : 'request not found' , status : 400}

            user.inviteRequests.forEach( request => {
                if(request._id.toString() === req.params.inviteId) {
                    if(request.status !== 'PENDING') throw {message : 'this invite already checked' , status : 400}
                    request.status = 'REJECTED'
                    user.save().then(() => {
                        res.send({
                            status : 200,
                            success : true,
                            message : 'invite request to join team rejected successfully !'
                        })
                    })
                }
            })

        } catch (error) {
            next(error)
        }
    }

    async getInviteRequests(req ,res , next) {
        try {
            const [user] = await userModel.aggregate([
                {
                    $match : { username : req.username }
                },
                {
                    $project : {
                        inviteRequests : 1,
                        _id : 0,
                        requests : {
                            $filter : {
                                input : '$inviteRequests',
                                as : 'invites',
                                cond : {
                                    $eq : ['$$invites.status' , req.query.status]
                                }
                            }
                        }
                    }
                }

            ])
            
            res.send({
                status : 200,
                success : true,
                inviteRequests : req.query.status ? user.requests : user.inviteRequests
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new UserControllers()