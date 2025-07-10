const crypto = require('crypto')

const algorithm = 'aes-256-cbc';
const secretKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

exports.encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    return cipher.update(text, "utf-8", 'hex') + cipher.final('hex');
}

exports.decrypt = (encryptedText) => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    return decipher.update(encryptedText, "hex", "utf-8") + decipher.final('utf-8');
}

