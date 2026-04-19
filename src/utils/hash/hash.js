import bcrybt from "bcrypt"
export const hash = ({plainText, rounds = Number(process.env.ROUNDS)}) => {
    return bcrybt.hashSync(plainText, rounds)
}

export const compareHash = ({plainText, hash}) => {
    return bcrybt.compareSync(plainText, hash)
}