const mongoose = require("mongoose");
const tokenSchema = mongoose.Schema({
	userId: {
		type: String,
		required: true,
		ref: "user",
	},
	token: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 3600, // this is the expiry time in seconds
	},
});
mongoose.connection.models = {};
const Token = mongoose.model("resettoken", tokenSchema);
module.exports = Token;
