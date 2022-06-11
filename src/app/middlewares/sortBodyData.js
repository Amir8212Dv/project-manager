const sortBodyData = (req , res , next) => {
    req.updateData = {}
    Object.entries(req.body).map(([key , value] )=> {
        if (!!value) req.updateData[key] = value
    })
    next()
}

export default sortBodyData