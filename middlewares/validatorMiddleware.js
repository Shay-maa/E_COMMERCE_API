const { validationResult } = require("express-validator")

const validator = (req,res ,next)=>{
    const error = validationResult(req)
    if(!error.isEmpty()){
       return res.status(400).json({error:error.array()})
    }
    next();
}
module.exports = validator