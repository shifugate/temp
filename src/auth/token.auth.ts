import { Request, Response, NextFunction } from 'express';

export const AuthenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token)
        return res.status(401).json({ error: 'Access denied. No token provided.' });

    if (token !== process.env.API_BEARER_TOKEN)
        return res.status(403).json({ error: 'Invalid token.' });

    next();
};
