const express = require("express");
const User = require("../models/user.model");
const Token = require("../models/token.model");
const router = express.Router();
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Do Authentication

router.post("/login", async (req, res, next) => {
	const { email, password } = req.body;
	const user = await User.findUser(email, password);

	if (user) {
		req.session.user = user._id;
		return res.json({
			message: "You are successfully login",
			auth: true,
		});
	} else {
		return res.json({
			message: "Unable to login",
			auth: false,
		});
	}
});

router.post("/register", (req, res, next) => {
	const user = new User(req.body);
	user
		.save()
		.then((result) => {
			res.json({
				message: "Successfully created",
				auth: true,
			});
		})
		.catch((err) => {
			if (err.code == 11000) {
				res.status(409).json({ message: "Email already registered." });
			} else {
				res.json({
					message: "Unable to create account",
					auth: false,
				});
			}
		});
});

router.get("/loggedin", async (req, res) => {
	if (req.session && req.session.user) {
		return res.json({ message: "Session Found", auth: true });
	} else if (!req.session) {
		return res.json({ message: "No Session Found", auth: false });
	} else {
		return res.json({ message: "No Session Found", auth: false });
	}
});

router.get("/logout", async (req, res, next) => {
	cookie = req.cookies;
	for (var prop in cookie) {
		if (!cookie.hasOwnProperty(prop)) {
			continue;
		}
		res.cookie(prop, "", { expires: new Date(0) });
	}
	res.redirect("/");

	delete req.session.user;
});

router.post("/forgot", async (req, res, next) => {
	const email = req.body.email;

	User.findOne({ email: email }).then(async (user) => {
		if (!user) {
			return res.status(403).json({
				message: "Email doesn't exist",
			});
		}

		let prevtoken = await Token.findOne({ userId: user._id });
		if (prevtoken) await prevtoken.deleteOne();
		const resetToken = crypto.randomBytes(20).toString("hex");

		await new Token({
			userId: user._id,
			token: resetToken,
		}).save();

		await Token.findOne({ token: resetToken }).then((token) => {
			if (!token) {
				return res.status(401).json({
					message:
						"Can't find a token, please wait a few minutes and try again.",
				});
			}
			user.resetPasswordToken = token.token;
			user.save();
		});

		const transporter = new nodemailer.createTransport({
			host: "mail.privateemail.com",
			auth: {
				user: `${process.env.EMAIL_ADDRESS}`,
				pass: `${process.env.EMAIL_PASSWORD}`,
			},
			port: 465,
		});

		const mailOptions = {
			from: `${process.env.EMAIL_ADDRESS}`,
			to: `${user.email}`,
			subject: "Reset Password",
			text:
				"You are receiving this email because you (or someone else perhaps) has requested to reset your password for your account.\n\n" +
				"Please click on the following link within one hour to reset your password.\n\n" +
				`http://localhost:3000/reset?token=${resetToken}\n\n` +
				`If you did not request this, please ignore this email. \n`,
		};

		transporter.sendMail(mailOptions, (err, response) => {
			if (err) {
				console.log(err);
				res.status(403).json({
					message: "Please enter a valid email address.",
				});
			} else {
				res.status(200).json({
					message: "Recovery email sent",
				});
			}
		});
	});
});

router.post("/reset", (req, res) => {
	const { password } = req.body;
	Token.findOne({ token: req.query.token }).then((token) => {
		if (!token) {
			res.status(404).json("Password link is invalid or has expired");
		} else {
			User.findById(token.userId, (err, user) => {
				if (err) {
					return res.status(500).send("An unexpected error occurred");
				}
				if (!user) {
					return res
						.status(404)
						.send({ message: `We were unable to find a user for this token.` });
				}

				if (user.resetPasswordToken !== token.token) {
					return res.status(400).send({
						message:
							"User token and your token didn't match. You may have a more recent token in your mail list.",
					});
				}

				user.password = password;
				user.resetPasswordToken = "";
				user.save((err) => {
					if (err) {
						return res
							.status(500)
							.send({ message: "An unexpected error occurred" });
					}
				});

				return res.status(200).send({
					username: user.email,
					message: "Password link accepted",
				});
			});
		}
	});
});

module.exports = router;
