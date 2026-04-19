export const asyncHandler = (fn)=>{
    return (req, res, next)=>{
        // const result = fn(req, res, next)
        // if (result && typeof result.catch === 'function') {
        //     result.catch((error)=>{
        //         //  check if error is empty error
        //         if(Object.keys(error).length == 0){
        //             return next(new Error(error.message))
        //         }
        fn(req, res, next).catch((error)=>{
            return next(error)
        })
    }
}