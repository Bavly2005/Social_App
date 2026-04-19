const isAuthorized = (roles)=>{
    return (req, res, next) => {
        // roles ["user", "admin"]
        // 2 role ( user role ) ,,,,,,,,,, ( endpoint role )
        // user >>>>>> profile user
        // req.user >>>> role
        if (!roles.includes(req.user.roles)){
            return next(new Error("Not authorized!", { cause: 401 }))
        } 
        return next()
    }
}

export default isAuthorized