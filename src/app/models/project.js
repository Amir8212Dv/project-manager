import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
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
        type : mongoose.Types.ObjectId,
        required : true,
    },
    team : {
        type : mongoose.Types.ObjectId,
    },
    private : {
        type : Boolean,
        default : false
    },
    show : {
        type : Boolean,
        default : true
    }

} , {
    timestamps : true
})

const projectModel = mongoose.model('project' , projectSchema)

export default projectModel