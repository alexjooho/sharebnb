import CompanyCard from './CompanyCard'

/** Makes a list of companies
 * Props:
 * - companies: An array of objects that include companies
 *
 * RoutesList -> Companies -> CompanyCardList
 */
function CompanyCardList({companies}) {
    return (
        <>
            {companies.map(company => <CompanyCard key={company.handle} company={company}/>)}
        </>
    )
}

export default CompanyCardList;