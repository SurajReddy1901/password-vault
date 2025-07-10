const express = require("express");
const VaultItem = require("../models/VaultItem");
const { encrypt, decrypt } = require("../utils/encrypt");
const { checkPasswordBreach } = require("../utils/breachChecker");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
    const { title, username, password, url } = req.body;
    const encryptedPass = encrypt(password);
    const encryptedUsername = encrypt(username);
    const breachedCount = await checkPasswordBreach(password)
    const breached = breachedCount > 0;

    const newItem = new VaultItem({
        userId: req.user.id,
        title,
        username: encryptedUsername,
        password: encryptedPass,
        url,
        breached,
    });

    await newItem.save();
    res.json({ msg: "Entry added!" })
});

router.get("/", auth, async (req, res) => {
    try {
        const entries = await VaultItem.find({ userId: req.user.id });

        const decrypted = entries.map((e) => {
            try {
                const password = decrypt(e.password);
                const username = decrypt(e.username);
                return { ...e._doc, password, username };
            } catch {
                return { ...e._doc, password: "⚠️ Cannot decrypt", username: "⚠️ Cannot decrypt" };
            }
        });

        res.json(decrypted);
    } catch (err) {
        console.error("❌ Vault fetch error:", err.message);
        res.status(500).json({ msg: "Server error while fetching vault." });
    }
});


router.delete("/:id", auth, async (req, res) => {
    try {
        const deletedItem = await VaultItem.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id  // Ensures user can only delete their own item
        });

        if (!deletedItem) {
            return res.status(404).json({ msg: "Item not found or already deleted!" });
        }

        res.json({ msg: "Deleted successfully!" });
    } catch (err) {
        console.error("Delete error:", err.message);
        res.status(500).json({ msg: "Server error during delete!" });
    }
});

router.get("/check-breaches", auth, async (req, res) => {
    const entries = await VaultItem.find({ userId: req.user.id });
    const results = [];

    for (let entry of entries) {
        try {
            const plainPass = decrypt(entry.password);
            const breached = await checkPasswordBreach(plainPass);
            if (breached && !entry.breached) {
                entry.breached = true;
                await entry.save();
            }

            results.push({
                title: entry.title,
                breached,
            });
        } catch (err) {
            results.push({
                title: entry.title,
                error: "⚠️ Could not decrypt",
            });
        }
    }

    res.json(results);
});

module.exports = router;