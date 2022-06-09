import jwt from 'jsonwebtoken'

const createToken = (data) => {
    return jwt.sign(data , process.env.SECRETE_KEY || 'secretekey')
}

export default createToken