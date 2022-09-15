import SearchForm from "./SearchForm";
import CompanyCardList from "./CompanyCardList";
import { useState, useEffect } from 'react';
import JoblyApi from './api';

/** Renders a list of all companies filtered by value of search form
 * State:
 * - Companies: An object:
 *  {data: [company, company...],
 *   isLoading: true/false}
 *
 * RoutesList -> Companies -> CompanyCardList
 */
function Companies() {
    const [companies, setCompanies] = useState({
        data: [],
        isLoading: true,
    })

    /** calls API to fetch companies based on optional filter */
    async function getCompanies(filter = '') {
        setCompanies({
            data: await JoblyApi.getCompanies(filter),
            isLoading: false
        })
    }

    // technically, whenever a search is made, the companies are loading but the isLoading stays
    // false because we don't set it back. We might need 3 states to handle this

    /** Calls api to get companies when page is first mounted */
    useEffect(function getCompaniesWhenMounted() {
        getCompanies();

    }, []);

    if (companies.isLoading) {
        return (
            <div className="spinner-border" style={{ width: "10rem", height: "10rem" }} role="status">
            </div>
        )
    }

    return (
        <div className="CompanyList col-md-8 offset-md-2">
            <SearchForm search={getCompanies} />
            <br />
            <CompanyCardList companies={companies.data} />
        </div>
    )
}

export default Companies;