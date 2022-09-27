import React from "react";
import Login from "./views/Login";
import Chat from "./views/Chat";
import { URL_PATHS } from "./config/url";
import ProtectedRoute from "./components/ProtectedRoutes";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
				<Route path={URL_PATHS.login} element={<Login />} />
				<Route
					path={URL_PATHS.home}
					element={
						<ProtectedRoute redirectPath={URL_PATHS.login}>
							<Chat />
						</ProtectedRoute>
					}
				/>
			</Routes>
    </Router>
  );
};

export default AppRoutes;
