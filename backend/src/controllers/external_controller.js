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
    const image_blob= new Blob([req.file.buffer],{type:req.file.mimetype})
    formData.append('image', image_blob, req.file.originalname)
    formData.append('country', 'GB')
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

const getReccomendationsHandler=async(req,res)=>{
    if(!(req.body.tags&&req.body.possible_species)){
        res.status(401).json({"Error":"You must include tags and possible_species in the request body, otherwise there is insufficient data to determine reccomendations got "+req.body.tags+" and "+req.body.possible_species})
        return 
    }
    const species_list_string=req.body.possible_species.join(",");
    const species_seen_string=req.body.tags.join(",");

    const get_reccomendations_prompt='You are the best reccomendation algorithm. Here is a list of possible species to draw from: '+species_list_string+'. Here is the characteristics of the species that the user most enjoys seeing: '+species_seen_string+'. Based on what the user has likes to see, guess what they else they would enjoy, you can consider mythological connections, habitat connections, anything you deem relevant. Only output the list as: "Species1,Species2,Species3,Species4" Do not include any other text, explanation, or instructions. No line breaks. No numbering. Follow this format exactly. If names are generic e.g. meadows, use a more specific placename';
    const response=await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
            {role:"user",content:get_reccomendations_prompt}
        ]
    })
    const response_content=response.choices[0].message.content;
    console.log("response:",response_content); 
    const reccomendations=response_content.split(",")
    console.log("sending back:",reccomendations)
    res.status(200).json({"reccomendations":reccomendations}) 

}

export {getNearbySpeciesLocationsHandler,identifySpeciesHandler,getReccomendationsHandler}
