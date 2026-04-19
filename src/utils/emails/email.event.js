import { EventEmitter } from "events";
import jwt from "jsonwebtoken"
import sendEmails, { subjects } from "./sendEmails.js"
import { signup } from "./generateHTML.js"
export const emailEmitter = new EventEmitter()

emailEmitter.on("sendEmial", async(email, otp, subject)=>{
    // Login send email
        //    const token = jwt.sign({email}, process.env.JWT_SECRET)
            // const link = `http://localhost:3000/auth/acctivate_account/${token}`


            await sendEmails({
                to: email, 
                subject,
                html: signup(otp) 
            })

})