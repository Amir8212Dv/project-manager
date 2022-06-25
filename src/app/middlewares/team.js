export const validateTeamData = async (req , res , next) => {
    try {
        req.teamData = {}
        Object.entries(req.body).forEach(([key , value]) => {
            if(key === 'name'  && value.trim().length > 3) return req.teamData[key] =  `${req.username}_` + value 
            else if(key === 'description' && value.trim().length > 3) return req.teamData[key] = value
            else if(key === 'tags') {
                const tagValues = value.filter(val => typeof val === 'string' && !!(val.trim()))
                return req.teamData[key] = tagValues
            }
            throw {message : 'invalide data sended' , status : 400}
        })
        next()
    } catch (error) {
        next(error)
    }
}
