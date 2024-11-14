import { AuthContext } from "providers/auth";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const withAuthenticated = (requiredPermission) => (WrappedComponent) => {
  return (props) => {
    // const navigate = useNavigate();
    // const { isAuthenticated, hasPermissionToAccessThisPage } =
    //   useContext(AuthContext);

    // useEffect(() => {
    //   if (!isAuthenticated()) {
    //     navigate("/signin");
    //     return;
    //   }

    //   hasPermissionToAccessThisPage(requiredPermission).then(
    //     (hasPermission) => {
    //       if (!hasPermission) {
    //         navigate("/users");
    //       }
    //     }
    //   );
    // }, []);

    // return isAuthenticated &&
    //   hasPermissionToAccessThisPage(requiredPermission) ? (
    //   <WrappedComponent {...props} />
    // ) : null;
    return <WrappedComponent {...props} />;
  };
};

export default withAuthenticated;
