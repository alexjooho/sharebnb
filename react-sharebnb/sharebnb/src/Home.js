import userContext from "./userContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import logo from "./ShareBnBLogo.PNG";

function Home() {
    const user = useContext(userContext);
    document.title = "ShareBnB";

    if (user) {
        return (
            <div className="Homepage">
                <div className="container-fluid text-center">
                    <img className="mb-4" width={500} height={400} src={logo} alt="ShareBnB logo" />
                    <h1 className="mb-4">ShareBnB</h1>
                    <h4 className="mb-4">All the places to book in one, convenient place.</h4>
                    <h1 className="mb-4">Welcome back {user.username}</h1>
                </div>
            </div>
        )
    }

    return (
        <div className="Homepage">
            <div className="container-fluid text-center">
                <img className="mb-4" width={500} height={400} src={logo} alt="ShareBnB logo" />
                <h1 className="mb-4">ShareBnB</h1>
                <h4 className="mb-4">All the places to book in one, convenient place.</h4>
                <Link className="btn btn-primary fw-bold me-3" to="/login">
                    Log in
                </Link>
                <Link className="btn btn-primary fw-bold me-3" to="/signup">
                    Sign up
                </Link>
            </div>
        </div>
    );
}

export default Home;