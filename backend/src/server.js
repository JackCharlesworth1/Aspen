import express from 'express'
import cors from 'cors'
import species_routes from './routers/species_api_router.js'
import user_routes from './routers/user_api_router.js'
import logger from './middleware/logger.js'
import {verifyUserAuthenticationHeader,verifyAdminAuthenticationHeader} from './middleware/authentication.js'
import {connectToDatabase} from './database_scripts/species_database.js'

const app=express()

const PORT=process.env.PORT||7000

app.use(cors())

app.use('/api/species', (req, res, next) => {
  if (req.is('application/json')) {
    express.json()(req, res, next);
  } else {
    next();
  }
});

app.use('/api/user', (req, res, next) => {
  if (req.is('application/json')) {
    express.json()(req, res, next);
  } else {
    next();
  }
});

app.use("/api/species/",logger)

app.use("/api/species/",verifyUserAuthenticationHeader)

app.use("/api/user/",logger)

app.use("/api/species/",species_routes)

app.use("/api/user",user_routes)

app.use('/api/static/images',express.static('static/images'))

app.use('/api/static/audio',express.static('static/audio'))

app.use('/api/static/user',express.static('static/user'))

app.listen(PORT,'0.0.0.0',()=>{console.log("Server is now always watching on port",PORT)})
