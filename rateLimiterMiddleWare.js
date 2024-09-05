const fs = require('fs');
const path = require('path');

const limiterFilePath = path.join(__dirname, 'Limiter.json');
let limiterData = {};
try {
    if (fs.existsSync(limiterFilePath)) {
        const fileContent = fs.readFileSync(limiterFilePath, 'utf8');
        limiterData = fileContent ? JSON.parse(fileContent) : {};
    } else {
        fs.writeFileSync(limiterFilePath, JSON.stringify({}), 'utf8');
    }
} catch (err) {
    console.error('Error reading Limiter.json:', err);
}

const postedIPs = new Map(Object.entries(limiterData));
function rateLimiterMiddleware(req, res, next) {
    const clientIP = req.connection.remoteAddress;

    if (req.method === 'POST') {
        if (postedIPs.has(clientIP)) {
            return res.status(429).send('You can only post once.');
        } else {
            postedIPs.set(clientIP, true);
            fs.writeFileSync(limiterFilePath, JSON.stringify(Object.fromEntries(postedIPs)), 'utf8');
        }
    }
    next();
}

module.exports = rateLimiterMiddleware;
