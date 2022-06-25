import validator from 'validator'
import hashPassword from '../../utils/hashPassword.js'

export const validateUserData =  (req , res , next) => {
    const { isMobilePhone , isEmail , isLength } = validator
    
    try {
        const {first_name , last_name , username , mobile , email , password , skills} = req.body
        req.userData = {}

        if(!!mobile) {
            if(!isMobilePhone(mobile , 'fa-IR')) throw 'enter a valid phone number'
            req.userData.mobile = mobile

        }
        if(!!password){
            if(!isLength(password , {min : 8})) throw 'password must be longer than 8 characters'
            const hashedPassword = hashPassword(password)
            req.userData.password = hashedPassword
        }
        
        if(!!email) {
            if(!isEmail(email)) throw 'enter a valid email address'
            req.userData.email = email
        }
        if(!!skills) {
            const skillsSet = new Set(skills.map(skill => {
                if(!!(skill.trim())) return skill
            }))
            req.userData.skills = Array.from(skillsSet)
        }
        
        if(!!first_name) req.userData.first_name = first_name
        if(!!last_name) req.userData.last_name = last_name
        if(!!username) req.userData.username = username
        next()
    } catch (error) {
        next({message : error , status : 400})
    }
    
}
