import validator from 'validator'

const validateUserData =  (req , res , next) => {
    
    const { mobile , email , password} = req.body
    const { isMobilePhone , isEmail , isLength } = validator

    try {
        if(!!mobile) if(!isMobilePhone(mobile , 'fa-IR')) throw 'enter a valid phone number'
        if(!!email) if(!isEmail(email)) throw 'enter a valid email address'
        if(!!password) if(!isLength(password , {min : 8})) throw 'password must be longer than 8 characters'
        next()
    } catch (error) {
        next({message : error , status : 400})
    }
    
}



export default validateUserData