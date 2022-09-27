import React from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteType = {
  children: any;
  redirectPath: string;
};

const ProtectedRoute: React.FC<ProtectedRouteType> = props => {
	const { children, redirectPath } = props;
  const getWallet = localStorage.getItem("wallet");
	if (!getWallet) {
		return <Navigate to={redirectPath} replace />;
	}
	return children;
};

export default ProtectedRoute;
