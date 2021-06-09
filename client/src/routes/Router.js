import React, { useContext, Suspense, lazy } from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";
import AuthApi from "../utils/AuthApi";

const home = lazy(() => import("../pages/Home"));

const login = lazy(() => import("../pages/Login"));
const reset = lazy(() => import("../pages/Reset"));
const forgot = lazy(() => import("../pages/Forgot"));
const register = lazy(() => import("../pages/Register"));
export default function Routes() {
	const authApi = useContext(AuthApi);

	return (
		<Router>
			<Suspense fallback={<></>}>
				<Switch>
					<Route exact path="/" component={home} />
					<Unprotected path="/login" component={login} auth={authApi.auth} />
					<Unprotected
						path="/register"
						component={register}
						auth={authApi.auth}
					/>
					<Unprotected path="/reset" component={reset} auth={authApi.auth} />
					<Unprotected path="/forgot" component={forgot} auth={authApi.auth} />
					<Protected path="/loggedin" auth={authApi.auth} />
					<Route component={<h1>Page Not Found</h1>} />
				</Switch>
			</Suspense>
		</Router>
	);
}

const Unprotected = ({ auth, component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(props) =>
				!auth ? <Component {...props} /> : <Redirect to="/login" />
			}
		/>
	);
};

const Protected = ({ auth, component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(props) =>
				auth ? <Component {...props} /> : <Redirect to="/loggedin" />
			}
		/>
	);
};
