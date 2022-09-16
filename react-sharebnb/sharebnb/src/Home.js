import userContext from "./userContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

function Home() {
    const user = useContext(userContext);
    document.title = "ShareBnB";

    if (user) {
        return (
            <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                <h1>ShareBnB</h1>
                <h4>All the places to book in one, convenient place.</h4>
                <h1>Welcome back {user.username}</h1>
            </div>)
    }

    return (
        <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
            <h1>ShareBnB</h1>
            <h4>All the places to book in one, convenient place.</h4>
            <Link className="btn btn-primary fw-bold me-3" to="/login">
                Log in
            </Link>
            <Link className="btn btn-primary fw-bold me-3" to="/signup">
                Sign up
            </Link>
        </div>
    );
}

export default Home;