import express from 'express'
import {getAllEntriesHandler,getSpecificEntryHandler,addNewSpeciesHandler,addImageToSpeciesHandler,
        updateSpeciesHandler,deleteSpeciesHandler,clearAllSpeciesHandler,addSpeciesLinkHandler,getSpeciesLinkHandler,updateSpeciesLinkHandler,deleteSpeciesLinkHandler,getAllSpeciesLinksHandler,addAudioToSpeciesHandler,getAllDistinctTagsHandler} from "../controllers/species_controller.js"
import {image_storage_middleware,audio_storage_middleware} from '../static_scripts/static_upload.js'

const router=express.Router()

router.get("/",getAllEntriesHandler)

router.get("/tags/",getAllDistinctTagsHandler)

router.get("/:name",getSpecificEntryHandler)

router.post("/",addNewSpeciesHandler)

router.post("/images/:name",image_storage_middleware.single('file'),addImageToSpeciesHandler)

router.post("/audio/:name",audio_storage_middleware.single('file'),addAudioToSpeciesHandler)

router.put("/:name",updateSpeciesHandler)

router.delete("/:name",deleteSpeciesHandler)

router.delete("/clear/",clearAllSpeciesHandler)


router.get("/links/:SpeciesOne/:SpeciesTwo",getSpeciesLinkHandler)

router.get("/links/all",getAllSpeciesLinksHandler)

router.post("/links/",addSpeciesLinkHandler)

router.delete("/links/:SpeciesOne/:SpeciesTwo",deleteSpeciesLinkHandler)

router.put("/links/:SpeciesOne/:SpeciesTwo",updateSpeciesLinkHandler)



export default router;
