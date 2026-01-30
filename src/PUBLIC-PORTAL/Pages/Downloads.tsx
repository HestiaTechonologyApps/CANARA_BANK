import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../Style/Downloads.css";
import { useNavigate } from "react-router-dom";
import type { Attachment } from "../../Types/Attachment.types";
import PublicAttachmentService from "../Services/DownloadsPublic.services";
import PublicPageConfigService from "../Services/Publicpage.services";
import type { PublicPage } from "../../ADMIN-PORTAL/Types/CMS/PublicPage.types";

const Downloads: React.FC = () => {
  const navigate = useNavigate()
  const [files, setFiles] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<PublicPage | null>(null);

  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        // CMS config
        const data = await PublicPageConfigService.getPublicPageConfig();
        // pick active config instead of data[0]
        const activeConfig = data.find(
          (item: PublicPage) => item.isActive === true
        );
        setConfig(activeConfig || null);

        const fileData = await PublicAttachmentService.getPublicAttachments();
        setFiles(fileData);
      } catch (error) {
        console.error("Failed to load attachments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttachments();
  }, []);

  const handleDownload = async (
    attachmentId: number,
    fileName: string
  ) => {
    try {
      const blob =
        await PublicAttachmentService.downloadAttachment(
          attachmentId
        );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error", error);
    }
  };
  return (
    <div className="downloads-wrapper">
      {/* HEADER SECTION */}
      <div className="downloads-header text-center py-4">
        <h2 className="downloads-title">  {config?.downloadsHeaderTitle || "Downloads"}</h2>
        <p className="downloads-subtitle">
          {config?.downloadsHeaderSubTitle ||
            "Access all forms and documents related to the Golden Jubilee Family Welfare Scheme"}
        </p>
      </div>
      <Container className="py-5">
        <Row className="g-4 justify-content-center">
          {/* CARD COLUMN */}
          <Col lg={12} md={10}>
            <Card className="downloads-card p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center">
                {config?.downloadsCardIconClass && (
                  <i className={config.downloadsCardIconClass}></i>
                )}
                {config?.downloadsCardTitle}
              </h5>
              {
                loading ? (
                  <div className="text-center py-5 downloads-loader">
                    <div className="loader-icon mb-3">
                      <span className="pulse-icon">⏳</span>
                    </div>
                    <h5 className="mb-1">Loading</h5>
                    <p className="text-muted small">Please wait a moment…</p>
                  </div>
                ) : (
                  files.map((file, index) => (
                    <Card key={index} className="file-item-card mb-3 p-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1 file-title"> {file.fileName}</h6>
                          <p className="file-desc"> {file.description ?? file.fileName}</p>
                        </div>
                        <i className={config?.downloadIcon}
                          role="button"
                          title="Download file"
                          onClick={() =>
                            handleDownload(
                              file.attachmentId,
                              file.fileName
                            )
                          }
                        ></i>
                      </div>
                    </Card>
                  )))}
            </Card>
          </Col>
        </Row>
        <div className="text-center mt-4">
          <button onClick={() => navigate("/contact-us")} className="support-btn">{config?.downloadsContactButtonText || "Need Support ? Contact Us"}</button>
        </div>
      </Container>
    </div>
  );
};

export default Downloads;
