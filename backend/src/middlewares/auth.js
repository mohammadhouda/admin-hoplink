import jwt from "jsonwebtoken";
import { failure } from "../utils/response.js";

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')){
        const token = authHeader.split(' ')[1];
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = { id: decoded.id, role: decoded.role || 'USER' };
            next();
        }catch(error){
            return failure(res, 'Invalid Token', 401);
        }
    } else {
        return failure(res, 'Authorization header missing or malformed', 401);
    }
}

export default authMiddleware;