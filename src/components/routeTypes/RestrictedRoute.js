import React from "react";
import { Route, Redirect } from "react-router-dom";
import {useSelector} from 'react-redux';

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  
  const isLoggedIn = useSelector(state => state.authState.isLoggedIn);

  return (
    <Route
      {...rest}
      render={routeProps =>
        isLoggedIn ? (
          <Redirect to={"/"} />
        ) : (
          <RouteComponent {...routeProps} />
        )
      }
    />
  );
};

export default PrivateRoute