import Application from "./app/server.js";
import dotenv from 'dotenv'
dotenv.config()

const dbUrl = 'mongodb://127.0.0.1:27017/project-Manager'

// new Application(process.env.PORT || 4000 , process.env.DB_URL || dbUrl)