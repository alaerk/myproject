const jwt = require('jsonwebtoken');
const User = require('../models/user');
module.exports.authetificateJwt =(req,res,next)=>{
    const token = req.cookies?.jwt;
    if(token){
        const test = jwt.verify(token,process.env.secret,(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/login');
            }
            else{
                next()
            }
        })
    }
    else{
        res.redirect('/login');
    }
}
// module.exports.getUser = (req,res,next)=>{
//     const token = req.cookies?.jwt;
//     if(token){
//         const test = jwt.verify(token,'alae secret',async (err,decodedToken)=>{
//             if(err){
//                 console.log(err.message);
//                 res.locals.user = null;
//                 next()
//             }
//             else{
//                 let user = await User.findById(decodedToken.id);
//                 res.locals.user = user;
//                 next();
//             }
//         })
//     }
//     else{
//         res.render('login');
//     }
// }
