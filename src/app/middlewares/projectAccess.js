import projectModel from "../models/project.js"
import userModel from "../models/user.js"

export const projectUpdateAccess = async (req , res , next) => {
    try {
        const project = await projectModel.findById(req.params.projectId)
        if(!project) throw {message : 'project not found' , message : 400}
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
        if(!project) throw {message : 'project not found' , status : 400}
        if(project.owner.toString() !== req.userId) throw {message : 'access denied' , status : 400}
        next()
    } catch (error) {
        next(error)
    }
} 
