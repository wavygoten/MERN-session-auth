import React from "react";
import { Link } from "react-router-dom";
const home = () => {
	return (
		<div>
			<Link to="/login">
				<h1>
					This is the home page, click here to go to /login to test the auth
				</h1>
			</Link>
		</div>
	);
};

export default home;
