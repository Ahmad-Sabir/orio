const crypto = require("crypto");

module.exports = getHashed = () => {
    const id = crypto.randomBytes(32).toString("hex");
    return `2@${id}`;
}