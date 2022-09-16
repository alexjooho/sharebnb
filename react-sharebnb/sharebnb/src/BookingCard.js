import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";

/** Makes a Booking card given a booking
 * Props:
 * - booking: An object with information about a booking
 *
 * RoutesList -> Bookings -> BookingCardList -> BookingCard
 */
function BookingCard({ booking }) {
  return (
    <div className="col-3 mb-5">
      <Card border="success" style={{ width: "18rem" }}>
        <Link className="booking-property" to={`/properties/${booking.propertyName}`}>
          <Card.Body >
            <Card.Title>{booking.propertyName}</Card.Title>
            <Card.Text>Booked from: {booking.startDate} through {booking.endDate}</Card.Text>
          </Card.Body>
        </Link>
      </Card>
    </div>
  );
}

// Try to use bootstrap to make actual Booking cards! This is uglilicious rn.
// Maybe use ReactStrap?

export default BookingCard;