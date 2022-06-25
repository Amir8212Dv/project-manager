import jwt from 'jsonwebtoken'
import userModel from '../models/user.js'
const checkAuthToken = async (req , res , next) => {
    try {
        const token = req.headers.authorization.split('Bearer ')[1]
        const checkToken = jwt.verify(token , process.env.SECRETE_KEY || 'secretekey')
        if(!checkToken) throw ''
        const user = await userModel.findById(checkToken._id)
        if (!user.token.includes(token)) throw ''
        req.userId = checkToken._id
        req.username = user.username
        next()
    } catch (error) {
        next({message : 'please login again' , status : 400})
    }
}

export default checkAuthToken