import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
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
    image : {
        type : String,
    },
    tags : {
        type : [String],
    },
    owner : {
        type : String,
        required : true,
    },
    team : {
        type : String,
    },
    private : {
        type : Boolean,
        default : false
    }
} , {
    timestamps : true
})

const projectModel = mongoose.model('project' , projectSchema)

export default projectModel