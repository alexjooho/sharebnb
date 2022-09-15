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
 */

function User() {
    const { username } = useContext(userContext);
    const { name } = useParams();

    const [user, setUser] = useState({
        data: {},
        isLoading: true,
    });

    const [userBookings, setUserBookings] = useState([]);
    const [showPropertyForm, setShowPropertyForm] = useState(false);
    const [propertyAdded, setPropertyAdded] = useState(false);
    const [errorAdding, setErrorAdding] = useState([]);

    /** calls api to get a user by name based on url parameter */
    async function getUser() {
        let resp;
        try {
            resp = await ShareApi.getUser(name);
        } catch (err) {
            return <NotFound />;
        }
        setUser({
            data: resp,
            isLoading: false,
        });
    }

    async function getBookings(username) {
        if (username === name) {
            const resp = await ShareApi.getBookings(username);
            setUserBookings(resp);
        }
    }

    useEffect(function getUserWhenMounted() {
        getUser();
        getBookings(username)
    }, []);

    function toggleShowForm() {
        setShowPropertyForm(!showPropertyForm);
    }

    async function addProperty(formData) {
        try {
            await ShareApi.addProperty(formData);
            setPropertyAdded(true);
        }
        catch (err) {
            setErrorAdding(err);
        }
    }

    if (user.isLoading) return <Loading />

    return (
        <>
            <PropertyCardList properties={user.data.properties} />
            {userBookings && <BookingCardList bookings={userBookings} />}
            {username === name &&
                showPropertyForm
                ? <ListPropertyForm toggleShowForm={toggleShowForm} handleSave={addProperty} />
                : <button onClick={toggleShowForm}>Add New Property Listing!</button>}
            {propertyAdded &&
                <Alert message="Added New Property Listing Successfully!" type="success" />}
            {errorAdding &&
                errorAdding.map(
                    err => <Alert key={err} message={err} type="danger" />)}
        </>
    )
}

export default User;