import jwt from 'jsonwebtoken'

const createToken = (data) => {
    console.log(process.env)
    return jwt.sign(data , process.env.SECRETE_KEY || 'secretekey' , {expiresIn : '7d'})
}

export default createToken