import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import Properties from './Properties';
import PropertyDetails from './PropertyDetails';
import User from './User';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import userContext from './userContext';
import { useContext } from "react";
import NotFound from './NotFound';

/** Function for handling all the routes of the Sharebnb app
 * Props:
 * - login: function for handling login
 * - signup: function for handling signup
*/
function RoutesList({ login, signup }) {

  const user = useContext(userContext);

  return (
    <Routes>
      <Route element={<Home />} path="/" />
      <Route element={<Properties />} path="/properties" />
      <Route element={<PropertyDetails />} path="/properties/:name" />
      <Route element={<User />} path="/users/:name" />
      {!user &&
        <>
          <Route element={<LoginForm login={login} />} path="/login" />
          <Route element={<SignupForm signup={signup} />} path="/signup" />
        </>
      }
      <Route element={<NotFound />} path="*" />
    </Routes>
  );
}

export default RoutesList;