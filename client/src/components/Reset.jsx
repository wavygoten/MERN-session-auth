import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/Reset.css";
import ErrorStatus from "./ErrorStatus.jsx";

const Reset = (props) => {
	const [newPassword, setNewPassword] = useState();
	const [confirmPassword, setConfirmPassword] = useState();
	const [error, setError] = useState();
	const [checkError, setCheckError] = useState();

	const handleOnChange = (e) => {
		if (e.target.name === "newPassword") {
			setNewPassword(e.target.value);
		} else {
			setConfirmPassword(e.target.value);
		}
	};

	const useQuery = () => {
		return new URLSearchParams(useLocation().search);
	};
	const param = useQuery().get("token").toString();

	const reset = async (e) => {
		e.preventDefault();
		setError(false);
		if (newPassword === confirmPassword) {
			await axios
				.post(`/reset?token=${param}`, {
					password: confirmPassword,
				})
				.then((res) => {
					console.log(res.data);
					// if (res.data.message === "Password Updated") {
					// 	return res.status(200).json({
					// 		message: "Password has been reset successfully.",
					// 	});
					// } else {
					// 	setError(true);
					// }
				})
				.catch((err) => {
					console.log(err.data);
				});
		} else {
			console.log("Passwords must match");
		}
	};
	return (
		<div>
			<div className="header">
				Reset
				<span className="underline" />
			</div>
			<div className="form">
				<div className="form-group">
					<label htmlFor="newPassword">New Password</label>
					<input
						type="password"
						name="newPassword"
						placeholder="New Password"
						onChange={handleOnChange}
					/>
				</div>
				{/* <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" name="username" placeholder="username" />
        </div> */}
				<div className="form-group">
					<label htmlFor="confirmPassword">Confirm Password</label>
					<input
						type="password"
						name="confirm"
						placeholder="Confirm Password"
						onChange={handleOnChange}
					/>
					{/* <ErrorStatus>{error ? `${checkError}` : ""}</ErrorStatus> */}
				</div>
				<div className="footer">
					<button type="submit" className="btn" onClick={reset}>
						Change Password
					</button>
				</div>
			</div>
		</div>
	);
};

export default Reset;
