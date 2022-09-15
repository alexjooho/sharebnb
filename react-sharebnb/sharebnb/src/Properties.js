import SearchForm from "./SearchForm";
import PropertyCardList from "./PropertyCardList";
import { useState, useEffect } from 'react';
import ShareApi from './api';

/** Renders a list of all properties filtered by value of search form
 * State:
 * - Properties: An object:
 *  {data: [Property, Property...],
 *   isLoading: true/false}
 *
 * RoutesList -> Properties -> PropertyCardList
 */
function Properties() {
    const [properties, setProperties] = useState({
        data: [],
        isLoading: true,
    })

    /** calls API to fetch properties based on optional filter */
    async function getProperties(filter = '') {
        setProperties({
            data: await ShareApi.getProperties(filter),
            isLoading: false
        })
    }

    // technically, whenever a search is made, the properties are loading but the isLoading stays
    // false because we don't set it back. We might need 3 states to handle this

    /** Calls api to get properties when page is first mounted */
    useEffect(function getPropertiesWhenMounted() {
        getProperties();
    }, []);

    if (properties.isLoading) {
        return (
            <div className="spinner-border" style={{ width: "10rem", height: "10rem" }} role="status">
            </div>
        )
    }

    return (
        <div className="PropertyList col-md-8 offset-md-2">
            <SearchForm search={getProperties} />
            <br />
            <PropertyCardList properties={properties.data} />
        </div>
    )
}

export default Properties;