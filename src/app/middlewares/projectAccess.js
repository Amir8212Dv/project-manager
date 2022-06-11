import projectModel from "../models/project"
import userModel from "../models/user"

export const projectUpdateAccess = async (req , res , next) => {
    try {
        const project = await projectModel.findById(req.params.projectId)
        const user = await userModel.findById(req.userId)
        if (project.owner !== user._id && !user.team.includes(project.team)) throw {message : 'access denied' , status : 400}
        
        next()
    } catch (error) {
        next(error)
    }
} 
export const projectDeleteAccess = async (req , res , next) => {
    try {
        const project = await projectModel.findById(req.params.projectId)
        if(project.owner.toString() !== req.userId) throw {message : 'access denied' , status : 400}
        req.project = project        
        next()
    } catch (error) {
        next(error)
    }
} 
export const getProjectOfUserAccess = async (req , res , next) => {
    try {
        const user = userModel.findById(req.userId)
        const project = projectModel.find({$and : [
            {private : false , show : true} ,
            {owner : req.body.userId},
            {team : {$in : user.team}}
            ]})
        
        next()
    } catch (error) {
        next(error)
    }
} 
export const getAllProjectsAccess = async (req , res , next) => {
    try {
        const project = projectModel.findById(req.params.projectId)

        next()
    } catch (error) {
        next(error)
    }
} 
export const getProjectOfTeamAccess = async (req , res , next) => {
    try {
        const project = projectModel.findById(req.params.projectId)

        next()
    } catch (error) {
        next(error)
    }
} 