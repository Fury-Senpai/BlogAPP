const jwt = require('jsonwebtoken');
// protected route
function isProtected(req,res,next){
    const token = req.cookies.token;
    if(!token){
        return res.redirect('/login');
    }
    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(error){
        console.log(error);
        res.redirect('/login');
    }
}

module.exports = isProtected;