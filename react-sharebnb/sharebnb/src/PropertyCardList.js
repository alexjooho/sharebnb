import PropertyCard from './PropertyCard'

/** Makes a list of properties
 * Props:
 * - properties: An array of objects that include properties
 *
 * RoutesList -> properties -> PropertyCardList
 */
function PropertyCardList({ properties }) {
    return (
        <div className="property-card-list row justify-content-center">
            {properties.map(property => <PropertyCard key={property.name} property={property} />)}
        </div>
    )
}

export default PropertyCardList;