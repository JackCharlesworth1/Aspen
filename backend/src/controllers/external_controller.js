import {OpenAI} from 'openai'

const OPEN_AI_API_KEY=process.env.OPEN_AI_API_KEY;

const openai=new OpenAI({
    apiKey:OPEN_AI_API_KEY
})


const getNearbySpeciesLocationsHandler=async (req,res)=>{
    if(!(req.body.origin&&req.body.species)){
        return res.status(400).json({"message":"You have to submit both an origin and a species in order to determine the location of an origin at a species"})
    }
    const get_locations_prompt='List the top 5 locations near '+req.body.origin+', where '+req.body.species+' are very likely to be found. The locations can be informal i.e. not a reserve, but you need to be specific, do not list an entire county/town or region. Output specific places. Think about what is a suitable habitat and work backwards. Only output the list as: "Placename1, Placename2, Placename3, Placename4, Placename5" Do not include any other text, explanation, or instructions. No line breaks. No numbering. Follow this format exactly. If names are generic e.g. meadows, use a more specific placename';
    const response=await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
            {role:"user",content:get_locations_prompt}
        ]
    })
    const response_content=response.choices[0].message.content;
    console.log(response_content); 
    const destinations=response_content.split(",")
    res.status(200).json({"locations":destinations}) 
}

export {getNearbySpeciesLocationsHandler}
