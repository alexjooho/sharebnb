import { useParams, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ShareApi from './api';
import BookForm from "./BookForm"

/** Renders details for a specific property based on URL parameter
 * State: property: an object with information about the property
 *
 * RoutesList -> Properties -> PropertyCardList -> PropertyCard -> PropertyDetails
 */

function PropertyDetails({ update }) {
    const { name } = useParams();
    const [reserve, setReserve] = useState(false);
    const [property, setProperty] = useState({
        data: {},
        isLoading: true,
    });

    /** calls api to get a property by name based on url parameter */
    async function getProperty() {
        let resp;
        try {
            resp = await ShareApi.getProperty(name);
        } catch (err) {
            return <Navigate to="/properties" />;
        }
        setProperty({
            data: resp,
            isLoading: false,
        });
    }

    /** Calls api to get property by name when page is first mounted */
    useEffect(function getPropertyWhenMounted() {
        getProperty();
    }, []);

    document.title = name;

    /** sets the reserve status to true/false */
    function toggleReserve() {
        setReserve(!reserve);
    }

    /** reserve form saved; toggle reserve status, and update in ancestor */
    async function handleSave(formData) {
        const resp = await ShareApi.bookProperty(formData);
        setReserve(false);
    }

    if (property.isLoading) {
        return (
            <div className="spinner-border" style={{ width: "10rem", height: "10rem" }} role="status">
            </div>
        );
    }

    return (
        <div className="PropertyDetails col-md-8 offset-md-2">
            <h1>{property.data.name}</h1>
            <img src={property.data.imageUrl} alt={property.data.name} />
            <h2>{property.data.address}</h2>
            <p>price: ${property.data.price}/night</p>
            <Link to={`/users/${property.owner}`}>
                <p>hosted by:{property.owner}</p>
            </Link>
            <button >book property!</button>
            {reserve && <BookForm property={property} handleSave={handleSave}/>}
        </div>
    );
}

export default PropertyDetails;