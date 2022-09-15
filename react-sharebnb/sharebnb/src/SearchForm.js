import { useState } from 'react';

/** Function for rendering a search form
 * Props:
 * -search: a function called when form is submitted
 *                 that changes state of parent when called
 *
 * State:
 * -filter: The form data
 *
 * RoutesList -> Companies -> SearchForm
 * RoutesList -> Jobs -> SearchForm
 */

function SearchForm({ search }) {

    const [filter, setfilter] = useState("");

    function handleChange(evt) {
        setfilter(evt.target.value);
    }

    function handleSubmit(evt) {
        evt.preventDefault();
        search(filter);
        setfilter("");
    }
    return (
        <form onSubmit={handleSubmit}>
            <input value={filter} onChange={handleChange} />
            <button>Search!</button>
        </form>
    );
}

export default SearchForm;