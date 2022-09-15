import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
// import ListGroup from "react-bootstrap/ListGroup";

/** Makes a property card given a property
 * Props:
 * - Property: An object with information about a property
 *
 * RoutesList -> Properties -> PropertyCardList -> PropertyCard
 */
function PropertyCard({ property }) {
  return (
    <div>
      <Link className="Property-card" to={`/properties/${property.name}`}>
        <Card border="success" style={{ width: "18rem" }}>
          <Card.Img src={property.imageUrl} alt={property.name} variant="top"/>
          <Card.Body >
            <Card.Title>{property.name}</Card.Title>
            <Card.Text>Address: {property.address}</Card.Text>
            <Card.Text>${property.price}/night</Card.Text>
          </Card.Body>
        </Card>
      </Link>
    </div>
  );
}

// Try to use bootstrap to make actual Property cards! This is uglilicious rn.
// Maybe use ReactStrap?

export default PropertyCard;