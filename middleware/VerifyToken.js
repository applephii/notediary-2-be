import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    let token;
    if (authHeader) token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: "Error",
            message: "Access token is required"
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                status: "Error",
                message: "Invalid access token"
            });
        }
        req.userId = decoded.id;
        next();
    });
};
