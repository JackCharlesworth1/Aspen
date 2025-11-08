import express from 'express'
import {getNearbySpeciesLocationsHandler} from '../controllers/external_controller.js'

const router=express.Router()

router.get("/getNearbySpeciesLocations",getNearbySpeciesLocationsHandler)

export default router;
