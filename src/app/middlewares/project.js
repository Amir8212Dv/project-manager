export const validateProjectData = async (req ,res , next) => {
    try {
        req.projectData = {}
        Object.entries(req.body).forEach(([key , value]) => {
            if(key === 'name' && value.trim().length > 3) return req.projectData[key] = `${req.username}_` + value
            else if (key === 'description' && value.trim().length > 3) return req.projectData[key] = value
            else if (key === 'private') return req.projectData[key] = value
            else if (key === 'tags') return req.projectData[key] = value.filter(tag => typeof tag === 'string' && !!(tag.trim()))
            throw {message : 'invalid data sended' , status : 400}
        })
        next()
    } catch (error) {
        next(error)
    }
}
