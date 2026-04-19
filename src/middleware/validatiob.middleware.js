import { Types } from "mongoose"
import joi from "joi"

const validation = (schema)=>{
    return (req,res, next)=> {
        // body param query
        const data = {...req.body, ...req.params, ...req.query} 
        console.log({ dataBeforeFile: data })
        // req.file || req.files
        if(req.file || req.files?.length){
            data.file = req.file || req.files
        }
        console.log({ dataAfterFile: data })


        const result = schema.validate(data, { abortEarly: false })

        if(result.error){
            const messageList = result.error.details.map((obj)=>(obj.message))
            return next(new Error(messageList, { cause: 400 }))     
        }
        return next()
    }
}

export const isValidObjectId = (value, helper)=>{
    if(Types.ObjectId.isValid(value)) return true
    return helper.message("Invalid ObjectId!")
}

export default validation


export const fileObj = joi.object({
        filedname: joi.string().valid("images").required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().required(),
        size: joi.number().required(),
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required(),
    })