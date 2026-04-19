import { Schema, model } from "mongoose"

// schema
const otpSchema = new Schema(
    {
        email: { type: String, required: true },
        otp: { type: String, required: true }
    },
    { timestamps: true }
)

otpSchema.index({ createdAt: 1 },{ expireAfterSeconds: 480 })
// model
const OTP = model("OTP", otpSchema)

export default OTP