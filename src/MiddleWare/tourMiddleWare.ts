import * as express from 'express';
import * as jwt from 'jsonwebtoken'

export const tourMiddleWare =((req,res:express.Response,next)=>{
    if(parseInt(req.headers.role) === 3){
        let token = req.headers.authorization.split(' ')[1];
        if(token){
            jwt.verify(token,'secretKey',(err,result)=>{
                if(err){
                    return res.status(403).json('Unauthorized User')
                }
                else{
                    req.user = result;
                    return next()
                }
            })
        }
        else{
            return res.status(401).json('Token Not Found')
        }
    }else{
        return next();
    }
})