import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import Alert from './Alert';


/** Function for rendering a login form
 *
 * Props:
 * -login: handles login
 *
 * State:
 * -formData: The form data
 *
 * RoutesList -> LoginForm
 */

function LoginForm({ login }) {
    const INITIAL_FORM_DATA = {
        username: '',
        password: '',
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

    /** Call parent function, clear form and return to homepage. */
    async function handleSubmit(evt) {
        evt.preventDefault();
        try {
            await login(formData);
            setFormData(INITIAL_FORM_DATA);
            navigate("/");
            // why doesn't return Navigate to= work?
            // nvm, it works, but you should still use useNavigate
        }
        catch (err) {
            setWrongCredentials(err[0]);
            console.log('error', err)
        }
    }
    // make sure to await the async function!!
    
    return (
        <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
            <h1>Login!</h1>
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
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.password}
                        aria-label="Password"
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

export default LoginForm;