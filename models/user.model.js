const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	resetPasswordToken: { type: String, default: this },
});

userSchema.statics.findUser = async function (email, password) {
	const user = await User.findOne({ email });
	if (!user) {
		return;
	}
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		return;
	} else {
		return user;
	}
};

userSchema.pre("save", async function (next) {
	const user = this;
	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

userSchema.methods.generateHash = async function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.local.password);
};

mongoose.connection.models = {};

const User = mongoose.model("SchemaName", userSchema);

module.exports = User;
