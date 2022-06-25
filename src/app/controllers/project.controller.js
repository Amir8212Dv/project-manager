import projectModel from "../models/project.js"
import userModel from "../models/user.js"
import teamModel from "../models/team.js"
import path from 'path'
import fs from 'fs'
import createImageLink from "../../utils/createImageLink.js"

class ProjectControllers {
    #aggregatePipeline = [
        {
            $lookup : {
                from : 'users',
                localField : 'owner',
                foreignField : 'username',
                as : 'owner'
            }
        },
        {
            $unwind : '$owner'
        },
        {
            $lookup : {
                from : 'teams',
                localField : 'team',
                foreignField : 'name',
                as : 'team'
            }
        },
        {
            $project : {
                'owner.password' : 0,
                'owner.projects' : 0,
                'owner.token' : 0,
                'owner.role' : 0,
                'owner.inviteRequests' : 0,
                'owner.__v' : 0,
                'team.projects' : 0,
                'team.__v' : 0,
            }
        }
    ]
    async createProject(req , res , next) {
        try {

            const project = await projectModel.create({...req.projectData , owner : req.username})
            
            const user = await userModel.findByIdAndUpdate(req.userId , {$addToSet : {projects : project.name}})

            res.status(201).send({
                status : 201,
                success : true,
                project
            })

        } catch (error) {
            if(error?.code === 11000) return next({message : `entered ${Object.keys(error.keyValue)[0]} already exists` , status : 400})
            next(error)
        }
    }


    async uploadImage(req , res , next) {
        try {
            const project = await projectModel.findOneAndUpdate(
                {name : req.params.projectName , owner : req.username} , 
                {image : path.join('images' , req.file.filename)} , 
                {returnDocument : 'after'}
            )
            if(!project) throw {message : 'project not found' , status : 400}

            res.status(201).send({
                status : 201,
                success : true,
                image : createImageLink(req, project.image)
            })
            
        } catch (error) {
            next(error)
        }
    }

    async getAllProjects(req , res , next) {
        try {
            const projects = await projectModel.aggregate([
                {
                    $match : {
                        owner : req.username
                    }
                },
                ...this.#aggregatePipeline
            ])

            res.send({
                status : 200,
                success : true,
                projects
            })
        } catch (error) {
            next(error)
        }
    }
    async getProjectByName(req , res , next) {
        try {
            const user = await userModel.findById(req.userId , {teams : 1})
            const [project] = await projectModel.aggregate([
                {
                    $match : {
                        $and : [
                            {name : req.params.projectName},
                            {$or : [{owner : req.username} , {team : {$in : user.teams}} ] }
                        ]
                    }
                },
                ...this.#aggregatePipeline
            ])
            if(!project) throw {message : 'project not found' , error : 400}

            res.send({
                status : 200,
                success : true,
                project
            })
        } catch (error) {
            next(error)
        }
    }
    async updateProject(req , res , next) {
        try {
            const user = await userModel.findById(req.userId , {teams : 1})

            const projectFilter = {name : req.params.projectName , $or : [{owner : req.username} , {team : {$in : user.teams}}  ]}
            if(req.projectData.name) projectFilter.owner = req.username
            
            const updatedProject = await projectModel.findOneAndUpdate(
                projectFilter , 
                req.projectData ,
                {returnDocument : 'after'})

            if(!updatedProject) throw {message : 'project not found' , status : 400}

            
            if(req.projectData.name && updatedProject.team) {
                const team = await teamModel.findOne({name : updatedProject.team})
                const index = team.projects.indexOf(req.params.projectName)
                team.projects[index] = req.projectData.name
                await team.save()
            }
            res.status(201).send({
                status : 201,
                success : true,
                project : updatedProject
            })
        } catch (error) {
            if(error?.code === 11000) return next({message : `entered ${Object.keys(error.keyValue)[0]} already exists` , status : 400})
            next(error)
        }
    }
    async removeProject(req , res , next) {
        try {
            const deletedProject = await projectModel.findOneAndDelete(
                {name : req.params.projectName , owner : req.username}
            )
            if(!deletedProject) throw {message : 'project not found' , status : 400}
            const deleteProjectFromTeam = await teamModel.updateOne({name : deletedProject.team} , {$pull : {projects : deletedProject.name}})

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