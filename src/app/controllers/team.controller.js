import projectModel from "../models/project.js"
import teamModel from "../models/team.js"
import userModel from "../models/user.js"

class TeamControllers {
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
            $lookup : {
                from : 'users',
                localField : 'members',
                foreignField : 'username',
                as : 'members'
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
                'members.password' : 0,
                'members.projects' : 0,
                'members.token' : 0,
                'members.role' : 0,
                'members.inviteRequests' : 0,
                'members.__v' : 0
            }
        },
        {
            $unwind : '$owner'
        }
    ]
    async createTeam(req , res , next) {
        try {
            const team = await teamModel.create({...req.teamData , owner : req.username , members : [req.username]})
            
            const user = await userModel.updateOne({username : req.username} , {$addToSet : {teams: team.name}})
            res.status(201).send({
                status : 201,
                success : true,
                team : team
            })
        } catch (error) {
            if(error?.code === 11000) return next({message : `entered ${Object.keys(error.keyValue)[0]} already exists` , status : 400})
            next(error)
        }
    }
    async getAllTeams(req , res , next) {
        try {
            const teams = await teamModel.aggregate([
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
                teams
            })
        } catch (error) {
            next(error)
        }
    }
    async getTeamByname(req , res , next) {
        try {
            const [team] = await teamModel.aggregate([
                {
                    $match : {
                        name : req.params.teamName,
                        members : req.username
                    }
                },
                ...this.#aggregatePipeline,
            ])
            
            if(!team) throw {message : `team not found`}
            res.send({
                status : 200,
                success : true,
                team
            })
        } catch (error) {
            next(error)
        }
    }
    async inviteUserToTeam(req , res , next) {
        try {

            const team = await teamModel.findOne({name : req.params.teamName})

            if(!team) throw {message : 'team not found' , status : 400}
            if(team.owner !== req.username) throw {message : "access denied"}
            if(team.members.includes(req.body.username)) throw {messaage : 'the user is already in team' , status : 400}

            const user = await userModel.findOne({username : req.body.username})
            if(!user) throw {message : 'user not found' , status : 400}
            
            const requestPermission = user.inviteRequests.find(request => 
                req.params.teamName === request.teamName && request.status === 'PENDING'
            )
                
            if(requestPermission) throw {message : "this user already invited to team" , status : 400}

            user.inviteRequests.push({
                teamName : team.name,
                from : req.username
            })
            await user.save()

            res.send({
                status : 200,
                success : true,
                message : 'invite sended to user successfully'
            })
        } catch (error) {
            next(error)
        }
    }
    async removeUserFromTeam(req , res , next) {
        try {
            const team = await teamModel.updateOne({owner : req.username , name : req.params.teamName} , {$pull : {members : req.body.username}})
            
            if(!team.matchedCount) throw {message : 'team not found' , status : 400}
            if(req.username === req.body.username) throw {message : "owner can't be removed from team" , status : 400}
            
             

            const user = await userModel.updateOne({username : req.body.username} , {$pull : {teams : team.name}})
            if(!user.matchedCount) throw {message : 'user not found' , status : 400}
            
            res.send({
                status : 200,
                success : true,
                message : 'user removed from team successfully'
            })
        } catch (error) {
            next(error)
        }
    }
    async updateTeam(req , res , next) {
        try {
            const teamFilter = {name : req.params.teamName , members : req.username }
            if(req.teamData.name) teamFilter.owner = req.username

            const team = await teamModel.findOneAndUpdate(
                teamFilter ,
                req.teamData ,
                {returnDocument : 'after'})
            if(!team) throw {message : 'team not found' , status : 400}

            if(req.teamData.name && req.params.teamName !== req.teamData.name) {
                const user = await userModel.find({teams : req.params.teamName} , {teams : 1})
                user.forEach(async item => {
                    const index = item.teams.indexOf(req.params.teamName)
                    item.teams[index] = req.teamData.name 
                    await item.save()
                })

                const updateProjectsTeam = await projectModel.updateMany(
                    {team : req.params.teamName},
                    {team : req.teamData.name}
                )
            }
            
            res.send({
                status : 200,
                success : true,
                team
            })

        } catch (error) {
            if(error?.code === 11000) return next({message : `entered ${Object.keys(error.keyValue)[0]} already exists` , status : 400})
            next(error)
        }    
    }
    async removeTeam(req , res , next) {
        try {
            const teamName = req.params.teamName

            const deletedTeam = await teamModel.deleteOne({name : teamName , owner : req.username})
            if(!deletedTeam.deletedCount) throw {message : 'team not found' , status : 400}
            const deleteProjects = await projectModel.updateMany({team : teamName} , {team : ''})

            const deleteFromUser = await userModel.updateMany({teams : req.params.teamName} , {$pull : {teams : teamName}})

            res.send({
                status : 200,
                success : true,
                message : `team : ${req.params.teamName} deleted successfully`
            })
        } catch (error) {
            next(error)
        }
    }
    async addProject(req, res , next) {
        try {


            const project = await projectModel.findOne({name : req.body.projectName , owner : req.username})
            if(!project) throw {message : 'project not found' , status : 400}
            if(project.team) throw {message : 'project is already in a team' , status : 400}

            const team = await teamModel.updateOne({name : req.params.teamName , owner : req.username} , {$addToSet : {projects : req.body.projectName}})
            if(!team.matchedCount) throw {message : 'team not found' , status : 400}
            
            project.team = req.params.teamName
            await project.save()

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