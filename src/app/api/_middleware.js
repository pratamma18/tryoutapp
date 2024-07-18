import csrfMiddleware from '../../middleware/csrfMiddleware';

export default function handler(req, res, next) {
    csrfMiddleware(req, res, next);
}