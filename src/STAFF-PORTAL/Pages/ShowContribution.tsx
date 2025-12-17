import React from "react";
import { Card, Table, Button } from "react-bootstrap";
import "../Style/ShowContribution.css";

const ShowContribution: React.FC = () => {
  return (
    <Card className="sc-card">
      <div className="sc-header fs-6">CONTRIBUTION</div>

      <Card.Body>
        <div className="table-responsive">
          <Table bordered hover size="sm" className="sc-table">
            <thead>
              <tr>
                <th>Year</th>
                {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(m => (
                  <th key={m}>{m}</th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2005</td>
                <td>50,000</td><td>50,000</td><td>50,000</td><td>50,000</td>
                <td>50,000</td><td>50,000</td><td>0</td><td>0</td>
                <td>0</td><td>0</td><td>0</td><td>0</td>
                <td className="fw-bold">350,000</td>
              </tr>
              <tr>
                <td>2004</td>
                <td>50,000</td><td>50,000</td><td>50,000</td><td>50,000</td>
                <td>50,000</td><td>50,000</td><td>50,000</td><td>50,000</td>
                <td>50,000</td><td>50,000</td><td>50,000</td><td>50,000</td>
                <td className="fw-bold">600,000</td>
              </tr>
              <tr>
                <td>2003</td>
                <td>0</td><td>0</td><td>50,000</td><td>50,000</td>
                <td>50,000</td><td>50,000</td><td>50,000</td><td>50,000</td>
                <td>50,000</td><td>50,000</td><td>50,000</td><td>50,000</td>
                <td className="fw-bold">500,000</td>
              </tr>
              <tr className="sc-total-row">
                <td>Total</td>
                <td colSpan={12}></td>
                <td className="sc-grand-total">1,450,000</td>
              </tr>
            </tbody>
          </Table>
        </div>

        <div className="sc-print">
          <Button variant="link" size="sm">
            🖨 Print
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ShowContribution;
