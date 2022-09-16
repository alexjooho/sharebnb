
/** Function for rendering list of already booked dates for a given property
 * 
 * Props:
 * - property: Property object
 * 
 * BookForm -> BookedDates
 */

function BookedDates({ property }) {

    const bookedDatesArray = property.bookings.map(
        booking => `${booking.startDate} through ${booking.endDate}`
    )

    return (
        <>
            <p>Unavailable on these dates:</p>
            <ul>
                {bookedDatesArray.map(booking =>
                    <li key={booking}>{booking}</li>)}
            </ul>
        </>
    )
}

export default BookedDates;