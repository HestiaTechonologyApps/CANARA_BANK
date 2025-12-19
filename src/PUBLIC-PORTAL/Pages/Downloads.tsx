import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../Style/Downloads.css";

interface DownloadItem {
  title: string;
  description: string;
}

const Downloads: React.FC = () => {
  const files: DownloadItem[] = [
    {
      title: "APPLICATION FOR MEMBERSHIP",
      description: "APPLICATION FOR MEMBERSHIP.",
    },
    {
      title: "AUTHORITY LETTER",
      description: "LETTER AUTHORISING DEDUCTION OF SUBSCRIPTION.",
    },
    {
      title: "RECEIPT",
      description: "FORM TO ACKNOWLEDGE RECEIPT OF PAYMENT.",
    },
    {
      title: "CLAIM FORM",
      description: "FORM FOR SUBMITTING THE CLAIM.",
    },
  ];

  return (
    <div className="downloads-wrapper">

      {/* HEADER SECTION */}
      <div className="downloads-header text-center py-4">
        <h2 className="downloads-title">Downloads</h2>
        <p className="downloads-subtitle">
          Access all forms and documents related to the Golden Jubilee Family Welfare Scheme
        </p>
      </div>

      <Container className="py-5">
        <Row className="g-4 justify-content-center">

          {/* CARD COLUMN */}
          <Col lg={6} md={10}>
            <Card className="downloads-card p-4">

              <h5 className="fw-bold mb-4 d-flex align-items-center">
                <i className="bi bi-folder2-open icon-header me-2"></i>
                Download Files
              </h5>

              {files.map((file, index) => (
                <Card key={index} className="file-item-card mb-3 p-3">
                  <div className="d-flex justify-content-between align-items-center">

                    <div>
                      <h6 className="mb-1 file-title">{file.title}</h6>
                      <p className="file-desc">{file.description}</p>
                    </div>

                    <i className="bi bi-download file-download-icon"></i>
                  </div>
                </Card>
              ))}

            </Card>
          </Col>
        </Row>

        <div className="text-center mt-4">
          <button className="support-btn">Contact Support</button>
        </div>
      </Container>
    </div>
  );
};

export default Downloads;
