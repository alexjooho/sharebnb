import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './Home';
import Companies from './Companies';
import CompanyDetails from './CompanyDetails';
import Jobs from './Jobs';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ProfileForm from './ProfileForm';
import userContext from './userContext';
import { useContext } from "react";

/** Function for handling all the routes of the Jobly app
 * Props:
 * - login: function for handling login
 * - signup: function for handling signup
 * - updateProfile: function for handling update profile
*/
function RoutesList({ login, signup, updateProfile }) {

  const { userData, isLoading } = useContext(userContext);
  let validRoutes = null;

  if (isLoading) {
    return (
      <div className="spinner-border" style={{width: "10rem", height: "10rem"}} role="status">
      </div>
    )
  }
  // TODO: could put this logic in the app (if is loading) so that we don't need to do it here

  if (userData) {
    validRoutes = (
      <>
        <Route element={<Companies />} path="/companies" />
        <Route element={<CompanyDetails />} path="/companies/:handle" />
        <Route element={<Jobs />} path="/jobs" />
        <Route element={<ProfileForm updateProfile={updateProfile} />} path="/profile" />
      </>
    )
  }

  else {
    validRoutes = (
      <>
        <Route element={<LoginForm login={login} />} path="/login" />
        <Route element={<SignupForm signup={signup} />} path="/signup" />
        <Route element={<Navigate to="/login" />} path="/companies" />
        <Route element={<Navigate to="/login" />} path="/companies/:handle" />
        <Route element={<Navigate to="/login" />} path="/jobs" />
        <Route element={<Navigate to="/login" />} path="/profile" />
      </>
    )
  }
  // is there a way to put multiple paths for a single route?
  // path = {["/companies", "/companies/:handle", "/jobs", "/profile"]} not working
  // THIS WAS TAKEN OUT IN V6, instead, you could just map over an array of the paths you want
  // but this is a hassle for such a low number of routes

  return (
    <Routes>
      <Route element={<Home />} path="/" />
      {validRoutes}
      <Route element={<Navigate to="/" />} path="*" />
    </Routes>
  );
}

export default RoutesList;