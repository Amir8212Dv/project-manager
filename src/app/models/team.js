import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
        unique : true
    },
    description : {
        type : String,
        required : true,
        trim : true
    },
    owner : {
        type : mongoose.SchemaTypes.ObjectId,
        required : true,
    },
    members : {
        type : [mongoose.SchemaTypes.ObjectId],
        required : true
    },
    projects : {
        type : [mongoose.SchemaTypes.ObjectId],
        default : []
    }
} , {
    timestamps : true
})

const teamModel = mongoose.model('team' , teamSchema)

export default teamModel