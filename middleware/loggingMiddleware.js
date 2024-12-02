import logger from '../utils/logger.js';

export const loggingMiddleware = (req, res, next) => {
    const start = Date.now();

    // Log incoming request details
    logger.info(`${req.method} request to ${req.url}`);
    logger.info(`Headers: ${JSON.stringify(req.headers)}`);

    if (req.body) {
        logger.info(`Body: ${JSON.stringify(req.body)}`);
    }

    // Capture response status code
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info(
            `${req.method} ${req.url} - Status: ${res.statusCode} - Duration: ${duration}ms`
        );
    });

    next();
};
