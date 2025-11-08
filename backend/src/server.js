import express from 'express'
import cors from 'cors'
import species_routes from './routers/species_api_router.js'
import user_routes from './routers/user_api_router.js'
import account_routes from './routers/account_api_router.js'
import {stripeWebhookHandler} from './controllers/account_controller.js'
import logger from './middleware/logger.js'
import {verifyUserAuthenticationHeader,verifyAdminAuthenticationHeader} from './middleware/authentication.js'
import {connectToDatabase} from './database_scripts/species_database.js'

const app=express()
const json_parser=express.json()

const PORT=process.env.PORT||7000

app.use(cors({
  origin: ['https://theaspenproject.cloud','https://api.theaspenproject.cloud'],
  methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
}))

//This route has to be used raw for signature verification, since express run in order, this has to be the first
app.use("/api/account/stripe/webhook",express.raw({type:'application/json'}),stripeWebhookHandler)

app.options('/*anypath',cors())

app.use('/api/species', json_parser);

app.use('/api/user', json_parser);

app.use('/api/account', json_parser);

app.use("/api/species",logger)

app.use("/api/species",verifyUserAuthenticationHeader)

app.use('/api/account', verifyUserAuthenticationHeader);

app.use("/api/user",logger)

app.use("/api/account",logger)

app.use("/api/species",species_routes)

app.use("/api/user",user_routes)

app.use("/api/account",account_routes)

app.use('/api/static/images',express.static('static/images'))

app.use('/api/static/audio',express.static('static/audio'))

app.use('/api/static/user',express.static('static/user'))

app.listen(PORT,'0.0.0.0',()=>{console.log("Server is now always watching on port",PORT)})
