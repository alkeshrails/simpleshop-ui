import { Route, Redirect } from "react-router-dom";

export const PublicRoute = ({ component: Component, ...rest }) => {
  const _id = localStorage.getItem('User_id');
  const id = localStorage.getItem('id');
  return (
    <Route {...rest} render={(props) =>
      _id ? (<Redirect to={{
        pathname: `home/${id}`
      }} />) : (<Component {...rest} {...props} />)
    }
    />
    );
};
