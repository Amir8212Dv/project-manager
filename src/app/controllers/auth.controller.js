import ValidateUserData from '../validation/user.js'
import userModel from '../models/user.js'
import createToken from '../../utils/createToken.js'
import hashPassword from '../../utils/hashPassword.js'


class AuthControllers {
    async register(req , res , next) {
        try {
            const { first_name , last_name , username , password , mobile , email , skills , role} = req.body
            await ValidateUserData.validateUsername(username)
            await ValidateUserData.validateMobile(mobile)
            await ValidateUserData.validateEmail(email)
            await ValidateUserData.validatePassword(password)

            const hashedPassword = hashPassword(password)
            
            const user = await userModel.create({first_name , last_name , username , password : hashedPassword , mobile , email , skills , role , token : []})
            const token = createToken(user._id.toString())
            user.token.push(token)
            await user.save()

            res.status(201).send({
                status : 201,
                success : true,
                data : {
                    token
                }
            })
        } catch (error) {
            next(error)
        }
    }
    login() {

    }
    resetPassword() {

    }
}

export default new AuthControllers