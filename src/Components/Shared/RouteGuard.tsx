import { Navigate } from "react-router-dom";
import { TUser } from "../../Types/TUser";

type TRouteGuardProps = {
  children: React.ReactNode;
  user: TUser;
  adminOnly?: boolean; 
};

const RouteGuard = ({ children, user, adminOnly = false }: TRouteGuardProps) => {
  if (!user) return <Navigate to={"/"} />;
  if (adminOnly && !user.isAdmin) return <Navigate to={"/"} />; // Redirect if not admin

  return <>{children}</>;
};

export default RouteGuard;
