import express, { json } from 'express';
import cors from 'cors';
import { resolve } from 'path';
import { config } from 'dotenv';
config({path: resolve('./config/.env')})
import { dbConnection } from "./DB/connection.js";
import { globalResponse } from "./src/utils/errorHandeling.js";
import * as routers from './src/modules/index.routes.js';

const app = express()

// var whitelist = [process.env.DASHBOARDLINK,process.env.LOCALHOST]
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   },
//   methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
//   credentials: true,
// }
const allowedOrigins = [process.env.DASHBOARDLINK,process.env.LOCALHOST,process.env.WEBSITELINK,process.env.WEB_LINK];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  credentials: true,
};
    app.use(cors()); 

    app.get('/',(req,res)=>{res.json({message:"hello app"})})  

    app.use(json())
    app.use('/company',routers.companyRouter)
    app.use('/service',routers.serviceRouter)
    app.use('/subService',routers.subServiceRouter)
    app.use('/about',routers.aboutRouter)
    app.use('/team',routers.teamRouter)
    app.use('/client',routers.clientRouter)
    app.use('/contact',routers.contactRouter)
    app.use('/IP',routers.IPRouter)
    app.use('/mainService',routers.mainServiceRouter)
    app.use('/home',routers.homeRouter)




    
    app.all('*',(req,res,next)=>{
      res.status(404).json({message:'404 not found URL'})
    })
    app.use(globalResponse)
    
    dbConnection()
    const port = process.env.PORT||3000
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))



