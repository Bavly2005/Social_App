import joi from "joi"

// sendOTP
export const sendOTP = joi.object({
    email: joi.string().email().required(),
}).required()


// register schema
export const register = joi.object({
    email: joi.string().email().required(),
    otp : joi.string().length(5).required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
    userName: joi.string().min(5).max(15).required(),
}).required()


// login schema
export const login = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
}).required()


// forget password
export const forgetPassword = joi.object({
    email: joi.string().email().required()
}).required()

// reset password
export const resetPassword = joi.object({
    email: joi.string().email().required(),
    otp: joi.string().length(6).required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password"))
}).required()

// new access
export const newAccess = joi.object({
    refresh_token: joi.string().required()
}).required()

// login with gmial
export const loginWithGmail = joi.object({
    idToken: joi.string().required()
}).required()