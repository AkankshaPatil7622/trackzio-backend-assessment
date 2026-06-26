const auth = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    if(!userId){
       return res.status(401).json({
            status :"fail",
            message : "Unauthorized access"
        })
    }
;
    req.userId = userId
    next();

}

module.exports = auth;