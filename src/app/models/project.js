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
        type : Array,
    },
    owner : {
        type : mongoose.SchemaTypes.ObjectId,
        required : true,
    },
    team : {
        type : [mongoose.SchemaTypes.ObjectId],
        default : []
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