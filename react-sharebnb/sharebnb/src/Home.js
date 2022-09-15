import userContext from "./userContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

function Home() {
    const user = useContext(userContext);

    if (user) {
        return (
            <>
                <h1>ShareBnB</h1>
                <h4>All the places to book in one, convenient place.</h4>
                <h1>Welcome back {user.username}</h1>
            </>)
    }

    return (
        <>
            <h1>ShareBnB</h1>
            <h4>All the places to book in one, convenient place.</h4>
            <Link className="btn btn-primary fw-bold me-3" to="/login">
                Log in
            </Link>
            <Link className="btn btn-primary fw-bold me-3" to="/signup">
                Sign up
            </Link>
        </>
    );
}

export default Home;