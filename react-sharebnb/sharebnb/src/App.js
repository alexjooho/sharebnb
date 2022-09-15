import { BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import RoutesList from "./RoutesList";
import Nav from "./Nav";
import userContext from "./userContext";
import ShareApi from "./api";
import jwt_decode from "jwt-decode";

/** App for rendering Sharebnb */
function App() {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  async function login(formData) {
    const newToken = await ShareApi.login(formData);
    setToken(newToken);
    localStorage.setItem('token', newToken);

  }

  async function signup(formData) {
    const newToken = await ShareApi.signup(formData);
    console.log("signup token", newToken);
    setToken(newToken);
    localStorage.setItem('token', newToken);
  }

  function logout() {
    ShareApi.token = null;
    setToken(null);
    localStorage.removeItem('token');
  }
  // what happens when someone logs out and it tries to decode null?
  // that's why we have the if(token) part

  useEffect(
    function updateUser() {
      async function getUserDetails() {
        if (token) {
          ShareApi.token = token;
          const { username } = jwt_decode(token);
          let currUser = await ShareApi.getUser(username); //should give us entire user object
          setUser({...currUser});
          // THIS IS VERY ANAL! Only if some evil evil person tries to use two tokens with same user
          // to create same reference point of currUser >:(
          setIsLoading(false);
          // put this directly into userData instead of payload so we don't get iat
        } else {
          setIsLoading(false);
        }
      }
      getUserDetails();
    },
    [token]
  );
  // useEffect runs AFTER the first render!!!

  // userContext should just be about presentational information about user
  // for the functions (login, signup, updateProfile), we should prop drill them

  if (isLoading) {
    return (
      <div className="spinner-border" style={{width: "10rem", height: "10rem"}} role="status">
      </div>
    )
  }
  
  return (
    <div className="App">
      <userContext.Provider
        value={user}
      >
        <BrowserRouter>
          <Nav logout={logout}/>
          <RoutesList login={login} signup={signup}/>
        </BrowserRouter>
      </userContext.Provider>
    </div>
  );
}

// let payload = {
//   username: user.username,
//   isAdmin: user.isAdmin || false,
// };

export default App;
