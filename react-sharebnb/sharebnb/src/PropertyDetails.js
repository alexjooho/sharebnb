import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react';
import JoblyApi from './api';
import JobCardList from "./JobCardList";

/** Renders details for a specific company based on URL parameter
 * State: company: an object with information about the company
 *
 * RoutesList -> Companies -> CompanyCardList -> CompanyCard -> CompanyDetails
 */
function CompanyDetails() {
    const [company, setCompany] = useState({
        data: {},
        isLoading: true,
    })

    const { handle } = useParams();

    async function getCompany() {
        setCompany({
            data: await JoblyApi.getCompany(handle),
            isLoading: false,
        })
    }

    /** Calls api to get company by handle when page is first mounted */
    useEffect(function getCompanyWhenMounted() {

        getCompany();
    }, []);
    // UseEffect has a missing dependency: but it works! =p
    // just ignore this, it just does this warning

    if (company.isLoading) {
        return (
            <div className="spinner-border" style={{ width: "10rem", height: "10rem" }} role="status">
            </div>
        )
    }

    return (
        <div className="CompanyDetails col-md-8 offset-md-2">
            <h1>{company.data.name}</h1>
            <h2>{company.data.description}</h2>
            <JobCardList jobs={company.data.jobs} />
        </div>
    )
}

export default CompanyDetails;