import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css";
import AuthApi from "../utils/AuthApi";
import ErrorStatus from "./ErrorStatus.jsx";

function Register() {
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	const authApi = useContext(AuthApi);
	const [error, setError] = useState();
	const [checkError, setCheckError] = useState();

	const register = async (e) => {
		e.preventDefault();
		setError(false);
		await axios
			.post("/register", { email, password })
			.then((res) => {
				if (res.data.auth) {
					authApi.setAuth(true);
				}
				if (res.data.message) {
					setError(true);
					setCheckError(res.data.message);
				}
			})
			.catch((err) => {
				if (err.response.status === 409) {
					setCheckError(err.response.data.message);
					setError(true);
				} else {
					console.log(err.message);
					setError(true);
				}
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
			<div className="header">Sign Up</div>
			<div className="form">
				<div className="form-group">
					<label htmlFor="email">Email</label>
					<input
						type="email"
						name="email"
						placeholder="email"
						onChange={handleOnChange}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						name="password"
						placeholder="password"
						required
						onChange={handleOnChange}
					/>
					<ErrorStatus>{error ? `${checkError}` : ""}</ErrorStatus>
				</div>
				<Link to="/forgot" className="fp-link">
					<span>Click here if you've forgotten your password.</span>
				</Link>
				<div className="footer">
					<button type="submit" className="btn" onClick={register}>
						Register
					</button>
				</div>
			</div>
		</div>
	);
}

export default Register;
