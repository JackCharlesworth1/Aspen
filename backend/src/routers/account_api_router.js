import express from 'express'
import {getAccountInfoHandler,createCheckoutSessionHandler,createPortalSessionHandler,stripeWebhookHandler} from '../controllers/account_controller.js'

const router=express.Router()

router.get("/info/:username",getAccountInfoHandler)

router.post('/create-checkout-session',createCheckoutSessionHandler)

router.post('/create-portal-session',createPortalSessionHandler)

export default router;
