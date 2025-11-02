import express from 'express'
import {registrationHandler,loginHandler,getIfUserSeenSpeciesHandler,setIfUserSeenSpeciesHandler,addUserSubmittedSightings,getNumberOfSightingImages,googleOAuthTokenGenerationHandler} from '../controllers/user_controller.js'
import {image_storage_middleware} from '../static_scripts/static_upload.js'

const router=express.Router()

router.post("/login",loginHandler)

router.post("/register",registrationHandler)

router.get("/speciesSeen/:name/:species",getIfUserSeenSpeciesHandler)

router.post("/speciesSeen",setIfUserSeenSpeciesHandler)

router.post("/sightings/:username/:species_name",image_storage_middleware.single('file'),addUserSubmittedSightings)

router.get("/sighting-count/:username/:species",getNumberOfSightingImages)

router.post("/auth/google",googleOAuthTokenGenerationHandler)

export default router;
