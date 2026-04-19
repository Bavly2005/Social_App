import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";

// file validation
export const fileValidation = {
    images: ["image/png", "image/jpeg"],
    files: ["application/pdf"]
}

// upload
export const upload = (fileType, folder) => {
    const storage = diskStorage(
        { 
            destination: folder,
            // (req, file, cb)=>{
            //     const folderPath = path.resolve(".", `${folder}/${req.user._id}`)
            //     console.log({ folderPath })
            //     fs.mkdirSync(folderPath)
            //     const folderName = `${folder}/${req.uesr._id}`
            //     cb(null, folderName)
            // }, 
            filename: (req, file , cb)=>{
                console.log(file)
                // save file
                cb(null, nanoid() + "__" + file.originalname)
            }
        })

    
    const fileFilter = function (req, file, cb) {
        // if(file.mimetype !== "image/png")
        if(!fileType.includes(file.mimetype))
            return cb(
            new Error(`Invalid format!, We only accept ${JSON.stringify(file.mimetype)}`,
            false)
            )

        return cb(null, true) 
    }


    const multeUpload = multer({ storage, fileFilter })

    return multeUpload
}