const locks = new Map(); // Track locks and their timestamps
const LOCK_TIMEOUT = 5000; // 5 seconds lock expiration

export const concurrencyMiddleware = async (req, res, next) => {
    let { action, data } = req.body;

    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        } catch (error) {
            return res.status(400).send('Invalid JSON format in data.');
        }
    }

    if (!data || !data.AppID) {
        return res.status(400).send('AppID is required for concurrency control.');
    }

    const resourceKey = `AppID-${data.AppID}`;

    try {
        await acquireLock(resourceKey);

        console.log(`[${new Date().toISOString()}] Lock acquired for ${resourceKey} (action: ${action})`);
        req.lockedResource = resourceKey;

        next();
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error acquiring lock for ${resourceKey}:`, error.message);
        res.status(500).send('Failed to acquire lock for the resource.');
    }
};

const acquireLock = (resourceKey) => {
    return new Promise((resolve, reject) => {
        const retryInterval = 100; // Retry every 100ms
        const maxRetries = 50; // Maximum retries to acquire a lock

        let retries = 0;

        const tryLock = () => {
            const currentTime = Date.now();
            const lockInfo = locks.get(resourceKey);

            if (!lockInfo || currentTime - lockInfo.timestamp > LOCK_TIMEOUT) {
                locks.set(resourceKey, { timestamp: currentTime });
                return resolve();
            }

            if (retries >= maxRetries) {
                return reject(new Error(`Timeout acquiring lock for ${resourceKey}`));
            }

            retries++;
            setTimeout(tryLock, retryInterval);
        };

        tryLock();
    });
};

export const releaseLock = (resourceKey) => {
    if (locks.has(resourceKey)) {
        locks.delete(resourceKey);
        console.log(`[${new Date().toISOString()}] Lock released for ${resourceKey}`);
    }
};
