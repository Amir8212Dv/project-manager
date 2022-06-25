import userModel from '../models/user.js'
import createToken from '../../utils/createToken.js'
import hashPassword from '../../utils/hashPassword.js'
import bcrypt from 'bcrypt'
import multer from 'multer'


class AuthControllers {
    register(req , res , next) {
        try {
            userModel.create({...req.userData , token : []})
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
                }).catch(err => {
                    if(err?.code === 11000) next({message : `entered ${Object.keys(err.keyValue)[0]} already exists` , status : 400})
                    else throw err
                })
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
            
            res.send({
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
            const user = await userModel.findOneAndUpdate({_id : req.userId} , {password : req.userData.password})
            if(!user) throw {message : 'user not found' , status : 400}
            res.status(201).send({
                status : 201,
                success : true,
                data : {
                    message : 'password changed successfully!'
                }
            })

        } catch (error) {
            next(error)
        }
    }
}

export default new AuthControllers