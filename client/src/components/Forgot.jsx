import React, { useState } from "react";
import "../styles/Forgot.css";
import axios from "axios";
import ErrorStatus from "./ErrorStatus.jsx";
import { Link } from "react-router-dom";

const Forgot = () => {
	const [email, setEmail] = useState();
	const [error, setError] = useState();
	const [success, setSuccess] = useState(false);

	const [checkError, setCheckError] = useState();
	const [checkSuccess, setCheckSuccess] = useState();

	const handleOnChange = (e) => {
		if (e.target.name === "email") {
			setEmail(e.target.value);
		}
	};

	const sendEmail = async (e) => {
		e.preventDefault();
		setError(false);
		await axios
			.post("/forgotPassword", { email })
			.then((res) => {
				console.log(res.data);
				if (res.data.message === "Email not in DB") {
					setError(true);
					setCheckError("Email doesn't exist");
				} else if (res.data.message === "Recovery email sent") {
					setSuccess(true);
					setCheckSuccess("Email has been sent");
				} else {
					setError(true);
					setCheckError(res.data.message);
				}
			})
			.catch((err) => {
				setError(true);
				if (err.response.data.message === undefined) {
					setCheckError("Unknown error occured " + err.response.status);
				} else {
					setCheckError(err.response.data.message);
				}
				// console.log(err.response);
			});
	};

	return (
		<div>
			<div className="header">Forgot Password</div>
			<div className="form">
				<div className="form-group">
					<label htmlFor="email">Email</label>
					<input
						type="email"
						name="email"
						placeholder="email"
						onChange={handleOnChange}
					/>
					<ErrorStatus>
						{(error ? `${checkError}` : "") ||
							(success ? `${checkSuccess}` : "")}
					</ErrorStatus>
				</div>

				<Link to="/login" className="fp-link">
					<span>Click here to go back to login.</span>
				</Link>
				<div className="footer">
					<button
						type="submit"
						className="btn"
						onClick={sendEmail}
						disabled={success}
					>
						Reset Password
					</button>
				</div>
			</div>
		</div>
	);
};

export default Forgot;
