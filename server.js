require("dotenv").config();
const PORT = process.env.PORT || 9848;
const express = require("express");
const router = require("./routes/auth.route");
const session = require("express-session");
const mongoose = require("mongoose");
const mongoStore = require("express-mongoose-store")(session, mongoose);
const app = express();
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const oneDay = 86400 * 1000;
const uuid = require("uuid");
const mongoose_store = new mongoStore(
	{ modelName: "ModelName" },
	{ ttl: 600000 }
);

setInterval(function () {
	mongoose_store.keepAlive();
}, 20000);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
	session({
		secret: uuid.v4(),
		resave: true,
		saveUninitialized: false,
		cookie: { path: "/", sameSite: false, maxAge: oneDay, secure: false },
		store: mongoose_store,
	})
);

// serve build files for deployment

app.use(express.static(path.join(__dirname, "./client/build")));

app.use("/", router);
app.use(
	cors({
		origin: [
			"http://localhost:3000",
			"http://localhost:5000",
			"http://127.0.0.1:3000/",
		],
		methods: ["GET", "POST"],
		credentials: true,
	})
);

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "./client/build", "index.html"));
});

mongoose.connect(process.env.MONGOURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
});

mongoose.connection.on("connected", () => {
	console.log("connected to database");
});

app.listen(PORT, () => {
	console.info("Running on port", PORT);
});
