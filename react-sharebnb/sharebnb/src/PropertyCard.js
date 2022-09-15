import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import "./CompanyCard.css"
// import ListGroup from "react-bootstrap/ListGroup";

/** Makes a company card given a company
 * Props:
 * - company: An object with information about a company
 *
 * RoutesList -> Companies -> CompanyCardList -> CompanyCard
 */
function CompanyCard({ company }) {
  let logo = null;

  if (company.logoUrl) {
    logo = <Card.Img variant="top" src={`${company.logoUrl}`} alt="Logo" />;
  }

  return (
    <div>
      <Link className="company-card" to={`/companies/${company.handle}`}>
        <Card border="success" style={{ width: "18rem" }}>
          <Card.Body >
            <Card.Title>{company.name}</Card.Title>
            {logo}
            <Card.Text>{company.description}</Card.Text>
          </Card.Body>
        </Card>
      </Link>
    </div>
  );
}

// Try to use bootstrap to make actual company cards! This is uglilicious rn.
// Maybe use ReactStrap?

export default CompanyCard;


