import projectModel from "../models/project.js"
import userModel from "../models/user.js"
import teamModel from "../models/team.js"
import path from 'path'
import mongoose from 'mongoose'

class ProjectControllers {
    async createProject(req , res , next) {
        try {

            const project = await projectModel.create({...req.body , owner : req.userId})

            res.status(201).send({
                status : 201,
                success : true,
                data : project
            })

        } catch (error) {
            next(error)
        }
    }
    async uploadImage(req , res , next) { // owner
        try {
            const project = await projectModel.findById(req.params.projectId)



            console.log(project.owner.toString() === req.userId) ////////////////////////////////////



            if (project.owner.toString() !== req.userId) throw {message : 'access denied' , status : 400}
            project.image = path.join('images' , req.file.filename)
            await project.save()

            res.status(201).send({
                status : 201,
                success : true,
                image : `${req.protocol}://${req.headers.host}/${project.image.replace('\\' , '/')}`
            })
            
        } catch (error) {
            next(error)
        }
    }

    async getAllProjects(req , res , next) {
        try {
            const projects = await projectModel.find({private : false , show : true})

            res.send({
                status : 200,
                success : true,
                projects
            })
        } catch (error) {
            next(error)
        }
    }
    async getProjectById(req , res , next) {
        try {
            const project = projectModel.findById(req.body.projectId)
            if(!project) throw {message : 'project not found' , status : 400}
            if(project.private || !project.show) {
                const user = userModel.findById(req.userId)
                if (!project.owner === user._id || !user.team.includes(project.team)) throw {message : 'this project is private' , status : 400}
            }
            res.send({
                status : 200,
                success : true,
                project
            })
        } catch (error) {
            next(error)
        }
    }
    async getAllProjectOfTeam(req , res , next) {
        try {
            const team = teamModel.findById(req.body.teamId)
            if(!team) throw {message : 'team not found' , status : 400}
            const user = userModel.findById(req.userId)
            if(!user.team.includes(team._id)) throw {message : 'you dont have access to the projects of this team' , status : 400}
            
            const projects = await projectModel.find({team : req.body.teamId})

            res.send({
                status : 200,
                success : true,
                projects
            })
        } catch (error) {
            next(error)
        }
    }
    async getAllProjectOfUser(req , res , next) { 
        try {
            // const user = userModel.findById(req.userId)
            // const project = projectModel.find({$and : [
            // {private : false , show : true} ,
            // {owner : req.body.userId},
            // {team : {$in : user.team}}
            // ]})
            const user = await userModel.findById(req.userId , {team : 1})
            const project = await projectModel.find({$and : [{owner : req.body.userId} , {$or : [{private : false , show : true} , {team : {$in : user.team}} , {owner : req.userId}]}]})
            res.send({
                status : 200,
                success : true,
                project
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    async updateProject(req , res , next) { // owner , team
        try {
            const project = await projectModel.findById(req.body.projectId)
            if(!project) throw {message : 'project not found' , status : 400}
            const user = userModel.findById(req.userId)
            if(project.owner !== user._id || !user.team.includes(project.team)) throw {message : 'you dont have access to this project' , message : 400}

            const updateProject = await projectModel.findByIdAndUpdate(req.body.projectId , req.updateData , {returnDocument : 'after'})

            res.status(201).send({
                status : 201,
                success : true,
                project : updateProject
            })
        } catch (error) {
            next(error)
        }
    }
    async removeProject(req , res , next) { // owner
        try {
            const project = projectModel.findById(req.body.projectId)
            const user = userModel.findById(req.userId)
            if (project.owner !== user._id) throw {message : 'you cant delete this project' , status : 400}
            const deletedProject = projectModel.findByIdAndDelete(req.body.projectId)

            res.send({
                status: 200,
                success : true,
                deletedProject
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new ProjectControllers()