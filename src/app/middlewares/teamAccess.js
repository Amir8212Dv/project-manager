import teamModel from "../models/team.js"

const deleteTeamAccess = async (req , res , next) => {
    try {
        const team = await teamModel.findById(req.params.teamId)
        if(req.userId !== team.owner) throw {message : 'access denied' , status : 400}
        next()
    } catch (error) {
        next(error)
    }
}

export default deleteTeamAccess