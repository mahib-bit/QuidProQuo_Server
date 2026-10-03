const { getAuth } = require('firebase-admin/auth');

//=========================Authentication Middleware=========================

const authMiddleware = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {

            return res.status(401).json({
                message: 'Authentication token is required'
            });

        }

        const token = authHeader.split('Bearer ')[1];

        const decodedToken = await getAuth().verifyIdToken(token);

        req.user = decodedToken;

        next();

    } catch (error) {

        console.error('Firebase token verification failed:', error);

        return res.status(401).json({
            message: 'Invalid or expired authentication token'
        });

    }

};

module.exports = authMiddleware;