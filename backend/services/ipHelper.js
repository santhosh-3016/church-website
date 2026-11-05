const os = require('os');

/**
 * Get primary non-internal IPv4 address for local network access (e.g. mobile phone access)
 */
const getLocalIp = () => {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return 'localhost';
};

/**
 * Get base URL for email and WhatsApp action links
 */
const getBaseUrl = (req = null) => {
    if (process.env.BACKEND_URL) {
        return process.env.BACKEND_URL.replace(/\/$/, '') + '/api/appointments/email-action';
    }

    const ip = getLocalIp();
    const port = process.env.PORT || 5000;

    // Use local IP so links clicked from mobile phones connect directly over Wi-Fi
    return `http://${ip}:${port}/api/appointments/email-action`;
};

module.exports = {
    getLocalIp,
    getBaseUrl
};
