import express from 'express'
import {getAccountInfoHandler} from '../controllers/account_controller.js'

const router=express.Router()

router.get("/info/:username",getAccountInfoHandler)

export default router;
