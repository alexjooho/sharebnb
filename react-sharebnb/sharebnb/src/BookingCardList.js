import BookingCard from './BookingCard'

/** Makes a list of bookings
 * Props:
 * - bookings: An array of booking objects
 *
 * RoutesList -> User -> BookingCardList -> BookingCard
 */
function BookingCardList({ bookings }) {
    return (
        <div className="booking-card-list">
            <p>Booked Properties: </p>
            {bookings.map(
                booking => <BookingCard
                    key={booking.propertyName + booking.dateBooked}
                    booking={booking} />)}
        </div>
    )
}

export default BookingCardList;