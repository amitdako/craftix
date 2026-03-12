import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If there is no token, go login.
  if (!token) {
    return <Navigate to="/login" />;
  }

  //if there is token, show him.
  return children;
};

export default ProtectedRoute;
