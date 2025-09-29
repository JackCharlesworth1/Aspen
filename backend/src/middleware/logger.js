import express from 'express'
import colors from 'colors'

const logger = (req,res,nxt)=>{
    const methodColors={
        'GET':'green',
        'POST': 'yellow',
        'PUT': 'blue',
        'DELETE': 'red'
    }
    console.log(req.method,req.protocol,req.url[methodColors[req.method]])
    nxt();
}

export default logger;

