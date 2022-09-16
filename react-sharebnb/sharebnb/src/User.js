import ShareApi from "./api";
import { useState, useEffect } from 'react';
import userContext from './userContext';
import { useContext } from "react";
import { useParams } from 'react-router-dom';
import Loading from './Loading';
import Alert from './Alert';
import ListPropertyForm from './ListPropertyForm';
import NotFound from "./NotFound";
import PropertyCardList from './PropertyCardList'
import BookingCardList from './BookingCardList'

/** Function for rendering a user's profile
 *
 * If a user is logged in and is viewing their own profile,
 * this function will render their bookings and allow user to add property listings
 *
 * States:
 * -user: User with data for user and isLoading
 * -userBookings: array of bookings for a user
 * -showPropertyForm: boolean indicating whether to show the add property form
 * -propertyAdded: boolean indicating whether a property was added
 * -errorAdding: array of error messages if there was an error adding a property
 *
 */

function User() {
    const currUser = useContext(userContext);
    const username = currUser ? currUser.username : null;
    const { name } = useParams();

    console.log('username', username)
    console.log('name', name)

    const [user, setUser] = useState({
        data: {},
        isLoading: true,
    });

    const [userBookings, setUserBookings] = useState(null);
    const [showPropertyForm, setShowPropertyForm] = useState(false);
    const [propertyAdded, setPropertyAdded] = useState(false);
    const [errorAdding, setErrorAdding] = useState(null);

    const [invalidUsername, setInvalidUsername] = useState(false);
    // need this to check if the username in the url parameter is an actual user

    /** calls api to get a user by name based on url parameter */
    async function getUser() {
        let resp;
        try {
            resp = await ShareApi.getUser(name);
            setUser({
                data: resp,
                isLoading: false,
            });
        } catch (err) {
            setInvalidUsername(true);
            // Can't return <NotFound /> here because it is an async function and
            // will result in an endless async loop
        }
    }

    document.title = `ShareBnB ${name}`;

    /** Get bookings for user with username of username */
    async function getBookings(username) {
        if (username === name) {
            const resp = await ShareApi.getBookings(username);
            setUserBookings(resp);
        }
    }

    /** Gets user and bookings for user when mounting page */
    useEffect(function getUserWhenMounted() {
        getUser();
        getBookings(username);
    }, []);

    /** Toggles state for showPropertyForm to true/fasle */
    function toggleShowForm() {
        setShowPropertyForm(!showPropertyForm);
    }

    /** Makes api call to add a property for a user */
    async function addProperty(formData) {
        try {
            await ShareApi.addProperty(formData);
            setPropertyAdded(true);
        }
        catch (err) {
            setErrorAdding(err);
        }
    }

    if (invalidUsername) return <NotFound message={`There is no such user: ${name}`} />;

    if (user.isLoading) return <Loading />

    let showForm = null;
    if (username === name) {
        showForm = showPropertyForm ?
            <ListPropertyForm toggleShowForm={toggleShowForm} handleSave={addProperty} />
            : <button onClick={toggleShowForm}>Add New Property Listing!</button>
    }

    return (
        <div className="container col-md-10 offset-md-1 col-lg-10 offset-lg-1">
            <div>Listed Properties: </div>
            <PropertyCardList properties={user.data.properties} />
            <br />
            {showForm}
            <br />
            {propertyAdded &&
                <Alert message="Added New Property Listing Successfully!" type="success" />}
            {errorAdding &&
                errorAdding.map(
                    err => <Alert key={err} message={err} type="danger" />)}
            <br />
            {userBookings && <BookingCardList bookings={userBookings} />}
        </div>
    )
}

export default User;