import {OpenAI} from 'openai'

const OPEN_AI_API_KEY=process.env.OPEN_AI_API_KEY;
const SPECIES_IDENTIFICATION_API_KEY=process.env.SPECIES_IDENTIFICATION_API_KEY

const openai=new OpenAI({
    apiKey:OPEN_AI_API_KEY
})


const getNearbySpeciesLocationsHandler=async (req,res)=>{
    if(!(req.params.origin&&req.params.species)){
        return res.status(400).json({"message":"You have to submit both an origin and a species in order to determine the location of an origin at a species"})
    }
    const get_locations_prompt='List the top 5 locations near '+req.params.origin+', where '+req.params.species+' are very likely to be found. The locations can be informal i.e. not a reserve, but you need to be specific, do not list an entire county/town or region. Output specific places. Think about what is a suitable habitat and work backwards. Only output the list as: "Placename1, Placename2, Placename3, Placename4, Placename5" Do not include any other text, explanation, or instructions. No line breaks. No numbering. Follow this format exactly. If names are generic e.g. meadows, use a more specific placename';
    const response=await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
            {role:"user",content:get_locations_prompt}
        ]
    })
    const response_content=response.choices[0].message.content;
    console.log("response:",response_content); 
    const destinations=response_content.split(",")
    console.log("sending back:",destinations)
    res.status(200).json({"locations":destinations}) 
}

const identifySpeciesHandler=async(req,res)=>{
    console.log("Started species identification process")
    const formData = new FormData()
    formData.append('image', req.file.buffer, {filename:req.file.originalname,contentType:req.file.mimetype})
    formData.append('country', 'UK')
    formData.append('threshold', '0.2')
    console.log("Assembled Form Data, Sending Request")
    const response = await fetch('https://www.animaldetect.com/api/v1/detect', {
    method: 'POST',
        headers: {
            'Authorization': 'Bearer '+SPECIES_IDENTIFICATION_API_KEY
        },
            body: formData
    })

    console.log("Finished Response")

    if(!response.ok){
        console.log("Something went wrong in making the request to identify the species:",response)
    }

    const result = await response.json()
    res.status(200).json(result)
}

export {getNearbySpeciesLocationsHandler,identifySpeciesHandler}
