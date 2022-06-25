import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
        lowercase : true,
        unique : true
    },
    description : {
        type : String,
        required : true,
        trim : true
    },
    owner : {
        type : String,
        required : true,
    },
    members : {
        type : [String],
        required : true
    },
    projects : {
        type : [String],
        default : []
    }
} , {
    timestamps : true
})

const teamModel = mongoose.model('team' , teamSchema)

export default teamModel