import csrf from 'csrf';
import cookieParser from 'cookie-parser';

const tokens = new csrf();

export default function csrfMiddleware(req, res, next) {
    cookieParser()(req, res, () => {
        if (req.method === 'GET') {
            const csrfToken = tokens.create(process.env.CSRF_SECRET);
            res.setHeader('Set-Cookie', `csrfToken=${csrfToken}; Path=/; HttpOnly`);
            return next();
        }

        if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
            const csrfToken = req.cookies.csrfToken;
            const tokenFromBody = req.body.csrfToken;

            if (!tokens.verify(process.env.CSRF_SECRET, csrfToken) || csrfToken !== tokenFromBody) {
                res.status(403).json({ message: 'CSRF token mismatch' });
                return;
            }
        }

        next();
    });
}
