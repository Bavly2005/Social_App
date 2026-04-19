import multer, { diskStorage } from "multer";


// file validation
export const fileValidation = {
    images: ["image/png", "image/jpeg"],
    files: ["application/pdf"]
}

// upload
export const uploadCloud = () => {
    const storage = diskStorage({})

    const multeUpload = multer({ storage })

    return multeUpload
}