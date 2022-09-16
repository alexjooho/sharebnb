import { useParams, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ShareApi from './api';
import BookForm from "./BookForm"
import Alert from './Alert';
import Loading from './Loading';
import NotFound from './NotFound';

/** Renders details for a specific property based on URL parameter
 * State: property: an object with information about the property
 *
 * RoutesList -> Properties -> PropertyCardList -> PropertyCard -> PropertyDetails
 */

function PropertyDetails() {
    const { name } = useParams();
    const [reserve, setReserve] = useState(false);
    const [property, setProperty] = useState({
        data: {},
        isLoading: true,
    });
    const [booked, setBooked] = useState(false);
    const [errorBooking, setErrorBooking] = useState([]);

    const [invalidProperty, setInvalidProperty] = useState(false);

    /** calls api to get a property by name based on url parameter */
    async function getProperty() {
        let resp;
        try {
            resp = await ShareApi.getProperty(name);
            setProperty({
                data: resp,
                isLoading: false,
            });
        } catch (err) {
            setInvalidProperty(true);
        }
    }
    document.title = name;

    /** Calls api to get property by name when page is first mounted */
    useEffect(function getPropertyWhenMounted() {
        getProperty();
    }, []);

    /** sets the reserve status to true/false */
    function toggleReserve() {
        setReserve(!reserve);
    }

    /** reserve form saved; toggle reserve status, and update in ancestor */
    async function handleSave(formData) {
        try {
            await ShareApi.bookProperty(formData);
            setReserve(false);
            setBooked(true);
        }
        catch (err) {
            setErrorBooking(err);
        }
    }

    if (invalidProperty) return <NotFound message={`There is no such property: ${name}`} />;

    if (property.isLoading) return <Loading />

    return (
        <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
            <h1>{property.data.name}</h1>
            <img width={500} height={500} src={property.data.imageUrl} alt={property.data.name} />
            <h2>{property.data.address}</h2>
            <p>price: ${property.data.price}/night</p>
            <Link to={`/users/${property.data.owner}`}>
                <p>hosted by: {property.data.owner}</p>
            </Link>
            {reserve
                ? <BookForm
                    property={property.data}
                    handleSave={handleSave}
                    toggleReserve={toggleReserve} />
                : <button className="btn-primary mb-3 rig btn btn-sm" onClick={toggleReserve}>Book property!</button>}
            {booked &&
                <Alert message="Booked Successfully!" type="success" />}
            {errorBooking &&
                errorBooking.map(
                    err => <Alert key={err} message={err} type="danger" />)}
        </div>
    );
}

export default PropertyDetails;