import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name : {
        type : String,
        required : true,
        trim : true
    },
    last_name : {
        type : String,
        required : true,
        trim : true
    },
    username : {
        type : String,
        required : true,
        trim : true,
        unique : true
    },
    avatar : {
        type : String,
        default : ''
    }
    ,
    mobile : {
        type : String,
        required : true,
        trim : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        trim : true,
        unique : true
    },
    skills : {
        type : Array,
        default : []
    },
    team : {
        type : [mongoose.Types.ObjectId],
        ref : 'team',
        default : []
    },
    role : {
        type : String,
        default : 'USER'
    },
    token : {
        type : Array,
        default : []
    }

} , {
    timestamps : true
})

const userModel = mongoose.model('user' , userSchema)

export default userModel