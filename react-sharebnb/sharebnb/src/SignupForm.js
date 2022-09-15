import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import Alert from './Alert';

/** Function for rendering a signup form
 * Props:
 * - signup: function for handling signup

 * State:
 * -formData: The form data
 *
 * RoutesList -> SignupForm
 */

function SignupForm({ signup }) {
    const INITIAL_FORM_DATA = {
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
    }
    const navigate = useNavigate();

    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [wrongCredentials, setWrongCredentials] = useState('');

    /** Update form input. */
    function handleChange(evt) {
        const fieldName = evt.target.name;
        const value = evt.target.value;

        setFormData(currData => ({ ...currData, [fieldName]: value }))
    }

    /** Call parent function and clear form. */
    async function handleSubmit(evt) {
        evt.preventDefault();
        try {
            await signup(formData);
            setFormData(INITIAL_FORM_DATA);
            navigate("/");
        }
        catch (err) {
            setWrongCredentials(err[0]);
        }
    }
    return (
        <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
            <h1>Signup</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Username</label>
                    <input
                        id="username"
                        name="username"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.username}
                        aria-label="Username"
                    />
                </div>

                <div className="mb-3">
                    <label>Password</label>
                    <input type="password"
                        id="password"
                        name="password"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.password}
                        aria-label="Password"
                        minLength="5"
                    />
                </div>

                <div className="mb-3">
                    <label>First Name</label>
                    <input
                        id="firstName"
                        name="firstName"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.firstName}
                        aria-label="First Name"
                    />
                </div>

                <div className="mb-3">
                    <label>Last Name</label>
                    <input
                        id="lastName"
                        name="lastName"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.lastName}
                        aria-label="Last Name"
                    />
                </div>

                <div className="mb-3">
                    <label>Email</label>
                    <input
                        id="email"
                        name="email"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.email}
                        aria-label="Email"
                    />
                </div>
                {wrongCredentials &&
                    <Alert message={wrongCredentials} type="danger"/>}

                <button className="btn-primary rig btn btn-sm">
                    Submit!
                </button>
            </form>
        </div>
    );
}

export default SignupForm;