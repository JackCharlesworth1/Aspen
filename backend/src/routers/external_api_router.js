import express from 'express'
import {getNearbySpeciesLocationsHandler,identifySpeciesHandler,getReccomendationsHandler} from '../controllers/external_controller.js'
import {image_storage_middleware} from '../static_scripts/static_upload.js'

const router=express.Router()

router.get("/getNearbySpeciesLocations/:species/:origin",getNearbySpeciesLocationsHandler)

router.post("/identifySpecies",image_storage_middleware.single('file'),identifySpeciesHandler)

router.post("/reccomendations",getReccomendationsHandler)

export default router;
