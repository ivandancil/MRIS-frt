import { Navigate, useLocation } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  children: ReactNode;
}

function UserRoute({ children }: Props) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [unauthorized, setUnauthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!token || role !== "user") {
      toast.error("Unauthorized! Please Login.");
      setUnauthorized(true);
    }
      }, [token, role, location.pathname]);

      if (unauthorized) {
        return <Navigate to="/" replace />;
      }

  return children;
}

export default UserRoute;
