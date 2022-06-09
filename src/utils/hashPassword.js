import bcrypt from 'bcrypt'

const hashPassword = (data) => {
    return bcrypt.hashSync(data , 8)
}

export default hashPassword