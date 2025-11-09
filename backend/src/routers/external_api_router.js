import express from 'express'
import {getNearbySpeciesLocationsHandler} from '../controllers/external_controller.js'

const router=express.Router()

router.get("/getNearbySpeciesLocations/:species/:origin",getNearbySpeciesLocationsHandler)

export default router;
