import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './Home';
import Properties from './Properties';
import PropertyDetails from './PropertyDetails';
import User from './User';
import Bookings from './Bookings';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import userContext from './userContext';
import { useContext } from "react";

/** Function for handling all the routes of the Sharebnb app
 * Props:
 * - login: function for handling login
 * - signup: function for handling signup
*/
function RoutesList({ login, signup }) {

  const user = useContext(userContext);
  let validRoutes = null;

  // TODO: could put this logic in the app (if is loading) so that we don't need to do it here

  if (user) {
    validRoutes = (
      <>
        <Route element={<Bookings />} path="/bookings" />
      </>
    )
  }

  else {
    validRoutes = (
      <>
        <Route element={<LoginForm login={login} />} path="/login" />
        <Route element={<SignupForm signup={signup} />} path="/signup" />
      </>
    )
  }

  return (
    <Routes>
      <Route element={<Home />} path="/" />
      <Route element={<Properties />} path="/properties" />
      <Route element={<PropertyDetails />} path="/properties/:name" />
      <Route element={<User />} path="/users/:username" />
      {validRoutes}
      <Route element={<Navigate to="/" />} path="*" />
    </Routes>
  );
}

export default RoutesList;