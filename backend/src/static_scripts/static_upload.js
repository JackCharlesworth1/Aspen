import multer from 'multer'
import path from 'path'
import fs from 'fs'

const image_storage_middleware=multer({
    storage: multer.memoryStorage(),
    limits: {fileSize: 50*1024*1024} //5Mb
})


const audio_storage_middleware=multer({
    storage: multer.memoryStorage(),
    limits: {fileSize: 100*1024*1024} //10Mb
})

async function addImageToSpecies(req,res,name){
    return await addStaticFile(req,res,name.lower().replace(" ","_"),".jpg",["static","images"])
}
async function addAudioToSpecies(req,res,name){
    return await addStaticFile(req,res,name,".mp3",["static","audio"])
}

async function addSightingToUser(req,res,username,species_name,number,image_data){
    const filename=number.toString().toLowerCase()+".jpg"
    const __dirname=import.meta.dirname
    const filepath=path.join(__dirname,'..','..','static','user',username,'images',species_name,filename)
    await fs.writeFile(filepath,req.file.buffer,err=>{
        if(err) return new Error("Failed to copy file from buffer to permenant storage");
        return {ok:true}
    })
    return "Success"
}


async function addStaticFile(req,res,name,file_extention,path_from_root){
    const filename=name.toLowerCase()+file_extention
    const __dirname=import.meta.dirname
    let filepath=path.join(__dirname,'..','..')
    for(let i=0;i<path_from_root.length;i++){
        filepath=path.join(filepath,path_from_root[i])
    }
    filepath=path.join(filepath,filename)
    await fs.writeFile(filepath,req.file.buffer,err=>{
        if(err) return new Error("Failed to copy file from buffer to permenant storage");
        return {ok:true}
    })
    return "Success"
}

export {addImageToSpecies,addAudioToSpecies,addSightingToUser,image_storage_middleware,audio_storage_middleware}
