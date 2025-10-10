import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  children: ReactNode;
}

function AdminRoute({ children }: Props) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token || role !== "admin") {
      toast.error("Unauthorized Access. Admins only!");
      setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
        }, [token, role]);

        if (isAuthorized === false) {
          return <Navigate to="/" />;
        }

        if (isAuthorized === true) {
          return children;
        }

  // Optional: Return null or a loader while checking
  return null;
}

export default AdminRoute;
