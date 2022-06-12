import multer from 'multer'
import path from 'path'
import fs from 'fs'

const uploadFile = multer.diskStorage({
    destination : (req , file , cb) => {
        fs.mkdirSync(path.join(process.argv[1] , '..' , '..' , 'public' , 'images') , {recursive : true})
        cb(null , path.join(process.argv[1] , '..' , '..'  , 'public' , 'images'))
    },
    filename : (req , {mimetype} , cb) => {
        const imageName = req.baseUrl === '/user' ? req.userId : req.baseUrl === '/project' && req.params.projectId
        cb(null , `${imageName}.${mimetype.split('/')[1]}`)
    }
})

export default multer({storage : uploadFile , limits : {fileSize : 1024 * 1024 * 2}})