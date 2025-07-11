const crypto = require("crypto");
const secret = process.env.ENCRYPTION_SECRET;
const algorithm = "aes-256-ctr";
const key = crypto.createHash("sha256").update(secret).digest(); // 32 bytes key

exports.encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
};

exports.decrypt = (hash) => {
    const [ivHex, encryptedHex] = hash.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const encryptedText = Buffer.from(encryptedHex, "hex");
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString();
};
