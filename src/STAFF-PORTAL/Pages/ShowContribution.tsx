import React, { useEffect, useRef, useState } from "react";
import { Card, Table, Button, Spinner } from "react-bootstrap";
import "../Style/ShowContribution.css";
import { FaPrint } from "react-icons/fa6";
import type { MemberAccountDetail } from "../../ADMIN-PORTAL/Types/Contributions/MemberAccountsDetails.types";
import MemberAccountsDetailsService from "../../ADMIN-PORTAL/Services/Contributions/MemberAccountsDetails.services";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const ShowContribution: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  const [contributions, setContributions] = useState<MemberAccountDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true);
        setError(null);
        const storedUser = localStorage.getItem("user");
        if (!storedUser) { setError("User not found."); return; }
        const parsedUser = JSON.parse(storedUser);
        const memberId = parsedUser?.memberId;
        if (!memberId) { setError("Member ID not found."); return; }
        const data = await MemberAccountsDetailsService.getById(memberId);
        setContributions(data);
      } catch (err) {
        console.error("Failed to fetch contributions", err);
        setError("Failed to load contributions.");
      } finally {
        setLoading(false);
      }
    };
    fetchContributions();
  }, []);


  const grouped = contributions.reduce<Record<number, Record<number, number>>>(
    (acc, item) => {
      if (!acc[item.yearOf]) acc[item.yearOf] = {};
      acc[item.yearOf][item.monthCode] =
        (acc[item.yearOf][item.monthCode] ?? 0) + item.amount;
      return acc;
    },
    {}
  );

  const years = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

  const grandTotal = contributions.reduce((s, c) => s + c.amount, 0);

  const handlePrint = () => {
    if (!cardRef.current) return;
    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
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
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #000; padding: 6px; text-align: center; }
            th { background: #f2f2f2; }
            .sc-header { font-weight: bold; margin-bottom: 12px; text-align: center; }
            .sc-print { display: none !important; }
          </style>
        </head>
        <body>${cardRef.current.innerHTML}</body>
      </html>
    `);
    iframeDoc.close();
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  };

  return (
    <div ref={cardRef}>
      <Card className="sc-card">
        <div className="sc-header fs-6">CONTRIBUTION</div>
        <Card.Body>

          {/* ── Loading ── */}
          {loading && (
            <div className="d-flex justify-content-center py-4">
              <Spinner animation="border" />
            </div>
          )}

          {/* ── Error ── */}
          {!loading && error && (
            <div className="text-center text-danger py-4">{error}</div>
          )}

          {/* ── Empty ── */}
          {!loading && !error && contributions.length === 0 && (
            <div className="text-center text-muted py-4">
              No contribution records found.
            </div>
          )}

          {/* ── Table ── */}
          {!loading && !error && contributions.length > 0 && (
            <div className="table-responsive">
              <Table bordered hover size="sm" className="sc-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    {MONTHS.map((m) => (
                      <th key={m}>{m}</th>
                    ))}
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {years.map((year) => {
                    const monthMap = grouped[year];
                    const yearTotal = Object.values(monthMap).reduce(
                      (s, v) => s + v,
                      0
                    );
                    return (
                      <tr key={year}>
                        <td className="fw-medium">{year}</td>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (monthCode) => {
                            const amount = monthMap[monthCode];
                            return (
                              <td
                                key={monthCode}
                                style={{
                                  color: amount ? "#0f2a55" : "#adb5bd",
                                  fontWeight: amount ? 500 : 400,
                                }}
                              >
                                {amount
                                  ? amount.toLocaleString("en-IN")
                                  : "—"}
                              </td>
                            );
                          }
                        )}
                        <td className="fw-bold" style={{ color: "#0f2a55" }}>
                          {yearTotal.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    );
                  })}

                  {/* ── Grand Total Row ── */}
                  <tr className="sc-total-row">
                    <td className="fw-bold">Total</td>
                    <td colSpan={12}></td>
                    <td className="sc-grand-total fw-bold">
                      {grandTotal.toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          )}

          {/* ── Print button ── */}
          {!loading && contributions.length > 0 && (
            <div className="sc-print">
              <Button
                variant="button"
                size="sm"
                className="text-danger"
                onClick={handlePrint}
              >
                <FaPrint /> Print
              </Button>
            </div>
          )}

        </Card.Body>
      </Card>
    </div>
  );
};

export default ShowContribution;