import express, { json } from 'express';
import cors from 'cors';
import { resolve } from 'path';
import { config } from 'dotenv';
config({ path: resolve('./config/.env') })
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
const allowedOrigins = [process.env.DASHBOARDLINK, process.env.LOCALHOST, process.env.WEBSITELINK, process.env.WEB_LINK];

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
app.use(cors(corsOptions));

app.get('/', (req, res) => { res.json({ message: "hello app" }) })
app.use(json())
app.use('/company', routers.companyRouter)
app.use('/service', routers.serviceRouter)
app.use('/subService', routers.subServiceRouter)
app.use('/about', routers.aboutRouter)
app.use('/team', routers.teamRouter)
app.use('/client', routers.clientRouter)
app.use('/contact', routers.contactRouter)
app.use('/IP', routers.IPRouter)
app.use('/mainService', routers.mainServiceRouter)
app.use('/home', routers.homeRouter)
app.use('/admin', routers.adminRouter)
app.use('/jobApplication', routers.jobRouter)


app.all('*', (req, res, next) => {
  res.status(404).json({ message: '404 not found URL' })
})
app.use(globalResponse)

dbConnection()
const port = process.env.PORT || 3000



// import fs from 'fs';
// import pdf2json from 'pdf2json';

// const filePath = 'D://HBS Projects//HBS webSite//company project//Ahmed osama CV (2).pdf';

// const pdfParser = new pdf2json();

// // Listen for parsing errors
// pdfParser.on("pdfParser_dataError", errData => {
//     console.error('Error parsing PDF:', errData.parserError);
// });

// pdfParser.on("pdfParser_dataReady", pdfData => {
//     // Check if formImage and Pages exist
//     if (!pdfData.formImage || !pdfData.formImage.Pages) {
//         console.error('No pages found in the PDF data');
//         return;
//     }

//     // Extract text from all pages
//     const extractedText = pdfData.formImage.Pages.map(page => {
//         return page.Texts.map(text => decodeURIComponent(text.R[0].T)).join(' ');
//     }).join('\n');
    
//     console.log('Extracted Text:', extractedText);
// });

// // Load the PDF file
// pdfParser.loadPDF(filePath);



app.listen(port, () => console.log(`Example app listening on port ${port}!`))



