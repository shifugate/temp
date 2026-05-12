"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticateToken = void 0;
const AuthenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    if (token !== process.env.API_BEARER_TOKEN)
        return res.status(403).json({ error: 'Invalid token.' });
    next();
};
exports.AuthenticateToken = AuthenticateToken;
//# sourceMappingURL=token.auth.js.map