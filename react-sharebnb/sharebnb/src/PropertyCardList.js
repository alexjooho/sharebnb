import PropertyCard from './PropertyCard'

/** Makes a list of properties
 * Props:
 * - properties: An array of objects that include properties
 *
 * RoutesList -> properties -> PropertyCardList
 */
function PropertyCardList({properties}) {
    return (
        <>
            {properties.map(property => <PropertyCard key={property.name} property={property}/>)}
        </>
    )
}

export default PropertyCardList;