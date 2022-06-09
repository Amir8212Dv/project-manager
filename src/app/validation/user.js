import user from '../models/user.js'

class ValidateUserData {
    async validateMobile(mobile) {
        const phoneNumberRegex = /(0|\+98)?([ ]|-|[()]){0,2}9[1|2|3|4]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}/
        if (!phoneNumberRegex.test(mobile)) throw {message : 'enter a valid phone number'}
        const isMobileExists = await user.findOne({mobile})
        if (isMobileExists) throw {message : 'this phone number already used'}
    }
    async validateUsername(username) {
        const isUserExists = await user.findOne({username})
        if(isUserExists) throw {message : 'this username already used'}
    }
    async validateEmail(email) {
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if(!emailRegex.test(email)) throw {message : 'enter a valid email'}
        const isEmailExists = await user.findOne({email})
        if(isEmailExists) throw {message : 'this email is already used'}
    }
    async validatePassword(password) {
        if (password.length < 8) throw {message : 'password must be longer that 8 chars'}
    }
}

export default new ValidateUserData()