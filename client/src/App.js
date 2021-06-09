import React, { useState, useEffect } from "react";
import "./styles/App.css";
import Routes from "./routes/Router";
import AuthApi from "./utils/AuthApi";
import axios from "axios";

function App() {
	const [auth, setAuth] = useState(false);

	const readsession = async () => {
		await axios
			.get("/loggedin")
			.then((res) => {
				if (res.data.auth) {
					setAuth(true);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		readsession();
	}, []);

	return (
		<div>
			<AuthApi.Provider value={{ auth, setAuth }}>
				<Routes />
			</AuthApi.Provider>
		</div>
	);
}

export default App;
