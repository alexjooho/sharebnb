import { NavLink } from "react-router-dom";
import "./Nav.css"
import Navbar from 'react-bootstrap/Navbar';
import userContext from './userContext';
import { useContext } from "react";


/** Navbar for links to different routes 
 * Props:
 * - logout: function for handling logout
*/
function Nav({ logout }) {
    const user = useContext(userContext);

    return (
        <Navbar className="NavBar" bg="light" expand="lg">
            <NavLink className="home" to="/">
                ShareBnB
            </NavLink>
            <br />
            <NavLink className="properties" to="/properties">
                Properties
            </NavLink>
            <br />
            {user
                ? <><NavLink className="bookings" to="/bookings">
                    Your Bookings
                </NavLink>
                    <br />
                    <NavLink className="logout" onClick={logout} to="/">
                        Log out {user.username}
                    </NavLink>
                    <br />
                </>
                : <>
                    <NavLink className="login" to="/login">
                        Login
                    </NavLink>
                    <br />
                    <NavLink className="signup" to="/signup">
                        Signup
                    </NavLink>
                    <br />
                </>}
    </Navbar>
    );
}

// need some functionality for logout navlink to empty user state in app

export default Nav;