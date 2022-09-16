import React, { useState } from "react";
import userContext from './userContext';
import { useContext } from "react";
import BookedDates from "./BookedDates";

/** Form for adding.
 *
 * Props:
 * - property: The property object
 * - toggleReserve: function to call in parent to show or hide form
 * - handleSave: function to call in parent to add booking
 * 
 * State:
 * - formData: The form data
 *
 * PropertyDetails -> BookForm
 */

function BookForm({ property, toggleReserve, handleSave }) {

    const { username } = useContext(userContext);

    const initialFormData = {
        propertyName: property.name,
        startDate: "",
        endDate: "",
        username
    }

    const [formData, setFormData] = useState(initialFormData);

    /** Update form input. */
    function handleChange(evt) {
        const fieldName = evt.target.name;
        const value = evt.target.value;

        setFormData(currData => ({
            ...currData,
            [fieldName]: value
        }));
    }

    /** Call parent function and clear form. */
    function handleSubmit(evt) {
        evt.preventDefault();
        handleSave(formData);
        setFormData(initialFormData);
    }

    return (
        <>
            <form className="NewBookForm" onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label htmlFor="propertyName"> Property Name</label>
                    <input
                        id="propertyName"
                        name="propertyName"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.propertyName}
                        aria-label={property.name}
                        required
                        disabled={true}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="startDate"> Start Date </label>
                    <input
                        id="startDate"
                        name="startDate"
                        className="form-control"
                        placeholder="YYYY-MM-DD"
                        onChange={handleChange}
                        value={formData.startDate}
                        aria-label="Start Date"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="endDate"> End Date </label>
                    <input
                        id="endDate"
                        name="endDate"
                        className="form-control"
                        placeholder="YYYY-MM-DD"
                        onChange={handleChange}
                        value={formData.endDate}
                        aria-label="End Date"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="username"> Username </label>
                    <input
                        id="username"
                        name="username"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.username}
                        aria-label={username}
                        disabled={true}
                        required
                    />
                </div>

                <button type="submit" className="btn-primary rig btn btn-sm NewBookForm-addBtn">
                    Reserve!
                </button>
            </form>
            <button onClick={toggleReserve} className="btn-primary rig btn btn-sm NewBookForm-addBtn">
                Cancel
            </button>
            <BookedDates property={property} />
        </>
    );
}

export default BookForm;