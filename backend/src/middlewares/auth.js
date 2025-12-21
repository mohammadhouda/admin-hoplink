import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')){
        const token = authHeader.split(' ')[1];
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = { id: decoded.id, role: decoded.role || 'user' };
            next();
        }catch(error){
            return res.status(401).json({message: 'Invalid Token'});
        }
    } else {
        return res.status(401).json({message: 'Authorization header missing or malformed'});
    }
}

export default authMiddleware;