import express from "express";
import path from 'path'
import mongoose from "mongoose";
import AllRoutes from './routes/router.js'

class Application {
    #app = express()
    constructor(PORT , DB_URL) {
        this.configApplication()
        this.createServer(PORT)
        this.configDatabase(DB_URL)
        this.createRoutes()
        this.errorHandler()
    }
    configApplication() {
        this.#app.use(express.json())
        this.#app.use(express.urlencoded({extended : true}))
        this.#app.use(express.static(path.join(process.argv[1] , '..' , '..' , 'public')))
    }
    createServer(PORT) {
        this.#app.listen(PORT , (error) => {
            if (error) throw error
            console.log(`Server running of port ${PORT}`)
        })
    }
    configDatabase(DB_URL) {
        mongoose.connect(DB_URL , (error) => {
            if (error) throw error
            console.log('Connected to mongoDB successfully !')
        })
    }
    createRoutes() {
        this.#app.get('/' , (req , res) => {
            res.send('Project manager application with express & mongoDB')
        })

        this.#app.use(AllRoutes)
    }
    errorHandler() {
        this.#app.use((req , res , next) => {
            res.status(404).send({
                status : 404,
                success : false,
                message : 'page not found'
            })
        })
        this.#app.use((error , req , res , next) => {
            const status = error.code === 11000 ? 400 : error?.status || 500

            const message = error.code === 11000 ? `entered ${Object.keys(error.keyValue)[0]} already exists` :
            error?.message || 'Internal Server Error!'

            res.status(status).send({
                status,
                success : false,
                message
            })
        })
    }
}


export default Application