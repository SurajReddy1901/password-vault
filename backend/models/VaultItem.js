const mongoose = require('mongoose')

const VaultItemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    },
    title: String,
    username: String, 
    password: String, // Encrypted
    url: String ,
    breached: {
        type: Boolean, 
        default: false
    },
});

module.exports = mongoose.model("VaultItem", VaultItemSchema);