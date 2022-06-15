export const validateData = async (req , res , next) => {
    try {
        req.teamData = {}
        Object.entries(req.body).forEach(([key , value]) => {
            console.log(req.teamData)
            if(['name' , 'description'].includes(key) && value.trim().length > 4) return req.teamData[key] = value
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

