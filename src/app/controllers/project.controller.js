import projectModel from "../models/project.js"
import userModel from "../models/user.js"
import teamModel from "../models/team.js"
import path from 'path'
import fs from 'fs'

class ProjectControllers {
    async createProject(req , res , next) {
        try {

            const project = await projectModel.create({...req.body , owner : req.userId})

            res.status(201).send({
                status : 201,
                success : true,
                project
            })

        } catch (error) {
            next(error)
        }
    }



    // check for projects existense
    // send link for images when  sending  get  request


    async uploadImage(req , res , next) {
        try {
            const project = await projectModel.findByIdAndUpdate(req.params.projectId , {image : path.join('images' , req.file.filename)} , {returnDocument : 'after'})

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
            const user = await userModel.findById(req.userId , {team : 1})
            const projects = await projectModel.find({$or : [{owner : req.userId} , {$in : {team : user.team}}]})

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
            const project = await projectModel.find({_id : req.params.projectId , owner : userId})
            if(!project) throw {message : 'project not found' , status : 400}
            // if(project.private || !project.show) {
            //     const user = await userModel.findById(req.userId)
            //     if (!project.owner === user._id || !user.team.includes(project.team)) throw {message : 'this project is private' , status : 400}
            // }
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

            const user = await userModel.findById(req.userId , {team : 1})
            const projects = await projectModel.find({$and : [{team : req.params.teamId} , {$or : [{owner : req.userId} , {private : false , show : true} , {team : {$in : user.team}}]}]})

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

            const user = await userModel.findById(req.userId , {team : 1})
            const project = await projectModel.find({$and : [{owner : req.params.userId} , {$or : [{private : false , show : true} , {team : {$in : user.team}} , {owner : req.userId}]}]})
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
    async updateProject(req , res , next) {
        try {
            
            const updateProject = await projectModel.findByIdAndUpdate(req.params.projectId , req.updateData , {returnDocument : 'after'})

            res.status(201).send({
                status : 201,
                success : true,
                project : updateProject
            })
        } catch (error) {
            next(error)
        }
    }
    async removeProject(req , res , next) {
        try {
            const deletedProject = await projectModel.findByIdAndDelete(req.params.projectId)
            const deleteProjectFromTeam = await teamModel.updateOne({_id : deletedProject.team} , {$pull : {projects : deletedProject._id}})

            if(deletedProject.image) fs.unlinkSync(path.join(process.argv[1] , '..' , '..' , 'public' , deletedProject.image))
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