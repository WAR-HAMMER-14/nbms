const asynHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const validateToken = asynHandler(async(req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;



    
    if(authHeader && authHeader.startsWith("Bearer"))
    {
        // console.log(authHeader);
        token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, decode) => {
            if(err)
            {
                res.send("VALIDATION_ERROR");
                return;
            }

            req.admin = decode.admin
            next()  
        })

        if(!token){
            res.send("AUTH_KEY_NOT_PROVIDED");
            return;
        }
    }
    else
    {
        res.send("AUTH_KEY_NOT_PROVIDED");
        return;
    }

})


module.exports = validateToken
