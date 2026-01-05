import React, { useRef } from "react";
import { Card, Table, Button } from "react-bootstrap";
import "../Style/ShowContribution.css";
import { FaPrint } from "react-icons/fa6";

const ShowContribution: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const handlePrint = () => {
    if (!cardRef.current) return;
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);
    const iframeDoc = iframe.contentWindow?.document;
    if (!iframeDoc) return;
    iframeDoc.open();
    iframeDoc.write(`
  <!DOCTYPE html>
  <html>
    <head>
      <title>Canara Bank Employees Union – Contribution Statement</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        th, td {
          border: 1px solid #000;
          padding: 6px;
          text-align: center;
        }
        th {
          background: #f2f2f2;
        }
        .sc-header {
          font-weight: bold;
          margin-bottom: 12px;
          text-align: center;
        }
        /* 👇 HIDE PRINT BUTTON */
        .sc-print {
          display: none !important;
        }
      </style>
    </head>
    <body>
      ${cardRef.current.innerHTML}
    </body>
  </html>
`);
    iframeDoc.close();
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };

  return (
    <div ref={cardRef}>
      <Card className="sc-card">
        <div className="sc-header fs-6">CONTRIBUTION</div>
        <Card.Body>
          <div className="table-responsive">
            <Table bordered hover size="sm" className="sc-table">
              <thead>
                <tr>
                  <th>Year</th>
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
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
            <Button variant="button" size="sm" className="text-danger" onClick={handlePrint}>
              <FaPrint /> Print
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ShowContribution;
