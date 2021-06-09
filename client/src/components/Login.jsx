import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";
import AuthApi from "../utils/AuthApi";
import axios from "axios";
import ErrorStatus from "./ErrorStatus.jsx";

function Login() {
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	const [error, setError] = useState();
	const [checkError, setCheckError] = useState();

	const authApi = useContext(AuthApi);

	const handleSignin = async (e) => {
		e.preventDefault();
		setError(false);
		await axios
			.post("/login", { email, password })
			.then((res) => {
				if (res.data.auth) {
					authApi.setAuth(true);
				}
				setError(true);
				setCheckError(res.data.message);
			})
			.catch((err) => {
				setError(true);
				setCheckError(err.response.data.message);
				console.log(err);
			});
	};
	const handleOnChange = (e) => {
		if (e.target.name === "email") {
			setEmail(e.target.value);
		} else {
			setPassword(e.target.value);
		}
	};

	return (
		<div>
			<div className="header">Log In</div>
			<form className="form">
				<div className="form-group">
					<label htmlFor="email">Email</label>
					<input
						id="email"
						placeholder="email"
						type="email"
						name="email"
						onChange={handleOnChange}
					/>
				</div>
				{/* <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" name="username" placeholder="username" />
        </div> */}
				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						placeholder="password"
						name="password"
						required
						onChange={handleOnChange}
					/>
					<ErrorStatus>{error ? `${checkError}` : ""}</ErrorStatus>
				</div>
				<Link to="/register" className="fp-link">
					<span>Click here to create an account.</span>
				</Link>
				<div className="footer">
					<button type="submit" className="btn" onClick={handleSignin}>
						Login
					</button>
				</div>
			</form>
		</div>
	);
}

export default Login;
