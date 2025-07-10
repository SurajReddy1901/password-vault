const axios = require('axios')
const sha1 = require("sha1");
exports.checkPasswordBreach = async (plainPassword) => {
    const hashed = sha1(plainPassword).toUpperCase();
    const prefix = hashed.slice(0, 5);
    const suffix = hashed.slice(5);
    try {
        const res = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
        const lines = res.data.split('\n');
        for (let line of lines) {
            const [hashSuffix, count] = line.trim().split(':');
            if (hashSuffix === suffix) {
                return parseInt(count); // password is breached
            }
        }
        return 0;
    }
    catch (err) {
        console.error("Error checking password breach:", err.message);
        return 0;
    }
}