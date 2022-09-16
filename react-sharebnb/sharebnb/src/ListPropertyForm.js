import React, { useState } from "react";
import { useContext } from "react";
import userContext from "./userContext";

/** Form for adding a property.
 *
 * Props:
 * - toggleShowForm: function to call in parent to show or hide form
 * - handleSave: function to call in parent to add booking
 *
 * State:
 * - formData: The form data
 *
 * User -> ListPropertyForm
 */

function ListPropertyForm({ toggleShowForm, handleSave }) {

    const { username } = useContext(userContext);

    const initialFormData = {
        name: "",
        address: "",
        price: "",
        owner: username,
        file: null,
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

    function handleFileChange(evt) {
        setFormData(currData => ({
            ...currData,
            file: evt.target.files[0]
        }))
    }

    /** Call parent function and clear form. */
    function handleSubmit(evt) {
        evt.preventDefault();
        const submitFormData = new FormData();
        // HAVE TO DO new FormData() to allow sending of multipart form data!

        submitFormData.append("name", formData.name)
        submitFormData.append("address", formData.address)
        submitFormData.append("price", formData.price)
        submitFormData.append("image", formData.file)

        handleSave(submitFormData);
        setFormData(initialFormData);
    }

    return (
        <>
            <form
                className="NewListPropertyForm"
                onSubmit={handleSubmit}
                encType="multipart/form-data">

                <div className="mb-3">
                    <label htmlFor="name"> Property Name </label>
                    <input
                        id="name"
                        name="name"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.name}
                        aria-label="Property Name"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="address"> Address </label>
                    <input
                        id="address"
                        name="address"
                        className="form-control"
                        placeholder="Address"
                        onChange={handleChange}
                        value={formData.address}
                        aria-label="Address"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="price"> Price per night </label>
                    <input
                        id="price"
                        name="price"
                        className="form-control"
                        placeholder="Price per night"
                        onChange={handleChange}
                        value={formData.price}
                        aria-label="Price per night"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="owner"> Property Owner Username </label>
                    <input
                        id="owner"
                        name="owner"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.owner}
                        aria-label="property owner"
                        disabled={true}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="image">Image File</label>
                    <input
                        type="file"
                        accept="image/*"
                        id="image"
                        name="image"
                        className="form-control"
                        onChange={handleFileChange}
                        aria-label="image file"
                        required
                    />
                </div>

                <button type="submit" className="btn-primary mb-3 rig btn btn-sm NewListPropertyForm-addBtn">
                    Add Property to Listing!
                </button>
            </form>
            <button onClick={toggleShowForm} className="btn-primary rig btn btn-sm NewListPropertyForm-addBtn">
                Cancel
            </button>
        </>
    );
}

export default ListPropertyForm;