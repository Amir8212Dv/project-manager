import userModel from '../models/user.js'
import createToken from '../../utils/createToken.js'
import hashPassword from '../../utils/hashPassword.js'
import bcrypt from 'bcrypt'
class AuthControllers {
    register(req , res , next) {
        try {

            const { first_name , last_name , username , password , mobile , email , skills , role} = req.body

            const hashedPassword = hashPassword(password)
           
            userModel.create({first_name , last_name , username , password : hashedPassword , mobile , email , skills , role , token : []})
                .then(async user => {
                    const token = createToken({_id : user._id.toString()})
                    user.token.push(token)
                    await user.save()
        
                    res.status(201).send({
                        status : 201,
                        success : true,
                        data : {
                            token
                        }
                    })
                }).catch(err => {err?.code === 11000 && next({message : `entered ${Object.keys(err.keyValue)[0]} already exists` , status : 400})})

        } catch (error) {
            next(error)
        }
    }
    async login(req , res , next) {
        try {
            const {username , password} = req.body
            const user = await userModel.findOne({username})
            if(!user) throw {message : 'username or password is wrong!' , status : 401}
            const validatePassword = bcrypt.compareSync(password , user.password)
            if(!validatePassword) throw {message : 'username or password is wrong!' , status : 401}

            const token = createToken({_id : user._id.toString()})
            user.token.push(token)
            await user.save()
            
            res.status(200).send({
                status : 200,
                success : true,
                data : {
                    token : token
                }
            })

        } catch (error) {
            next(error)
        }
    }
    async logout (req ,res , next) {
        try {
            const user = await userModel.findById(req.userId)
            user.token = user.token.filter(token => token !== req.headers.authorization.split('Bearer ')[1])
            await user.save()
            res.send({
                status : 200,
                success : true,
                data : {
                    message : 'you are loged out success fully!'
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async resetPassword(req , res , next) {
        try {
            const {username , password} = req.body
            const newPassword = hashPassword(password)
            const user = await userModel.findOneAndUpdate({username} , {password : newPassword})
            if(!user) throw {message : 'username not found' , status : 400}
            res.status(201).send({
                status : 201,
                success : true,
                data : {
                    message : 'password changes successfully!'
                }
            })

        } catch (error) {
            next(error)
        }
    }
}

export default new AuthControllers