import SearchForm from "./SearchForm";
import PropertyCardList from "./PropertyCardList";
import { useState, useEffect } from 'react';
import ShareApi from './api';
import Loading from "./Loading";

/** Renders a list of all properties filtered by value of search form
 * State:
 * - Properties: An object:
 *  {data: [Property, Property...],
 *   isLoading: true/false}
 *
 * RoutesList -> Properties -> PropertyCardList
 */
function Properties() {
    document.title = "Properties";
    const [properties, setProperties] = useState({
        data: [],
        isLoading: true,
    });

    /** calls API to fetch properties based on optional filter */
    async function getProperties(filter = '') {
        setProperties({
            data: await ShareApi.getProperties(filter),
            isLoading: false
        });
    }

    // technically, whenever a search is made, the properties are loading but the isLoading stays
    // false because we don't set it back. We might need 3 states to handle this

    /** Calls api to get properties when page is first mounted */
    useEffect(function getPropertiesWhenMounted() {
        getProperties();
    }, []);

    if (properties.isLoading) return <Loading />;

    return (
        <div>
            <div className="PropertyList container-fluid col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                <SearchForm search={getProperties} />
            </div>
            <br />
            <div className="container-fluid col-md-10 offset-md-1 col-lg-10 offset-lg-1">
                <PropertyCardList properties={properties.data} />
            </div>
        </div>
    );
}

export default Properties;