import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../Style/Downloads.css";
import { PublicService } from "../../Services/PublicService";
import { useNavigate } from "react-router-dom";
import type { Attachment } from "../../Types/Attachment.types";
import PublicAttachmentService from "../Services/DownloadsPublic.services";

// interface DownloadItem {
//   title: string;
//   description: string;
// }

const Downloads: React.FC = () => {
  const navigate = useNavigate()
  const downloads = PublicService.downloads
  // const files: DownloadItem[] = [
  //   {
  //     title: "APPLICATION FOR MEMBERSHIP",
  //     description: "APPLICATION FOR MEMBERSHIP.",
  //   },
  //   {
  //     title: "AUTHORITY LETTER",
  //     description: "LETTER AUTHORISING DEDUCTION OF SUBSCRIPTION.",
  //   },
  //   {
  //     title: "RECEIPT",
  //     description: "FORM TO ACKNOWLEDGE RECEIPT OF PAYMENT.",
  //   },
  //   {
  //     title: "CLAIM FORM",
  //     description: "FORM FOR SUBMITTING THE CLAIM.",
  //   },
  // ];

  const [files, setFiles] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        const data =
          await PublicAttachmentService.getPublicAttachments();

        setFiles(data);
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
        <h2 className="downloads-title">{downloads.header.title}</h2>
        <p className="downloads-subtitle">
          {downloads.header.subtitle}
        </p>
      </div>

      <Container className="py-5">
        <Row className="g-4 justify-content-center">

          {/* CARD COLUMN */}
          <Col lg={12} md={10}>
            <Card className="downloads-card p-4">

              <h5 className="fw-bold mb-4 d-flex align-items-center">
                <i className={downloads.card.iconclass}></i>
                {downloads.card.title}
              </h5>

              {
              loading ? (
                <p className="text-center">Loading...</p>
              ) : (
              files.map((file, index) => (
                <Card key={index} className="file-item-card mb-3 p-3">
                  <div className="d-flex justify-content-between align-items-center">

                    <div>
                      <h6 className="mb-1 file-title"> {file.fileName}</h6>
                      <p className="file-desc"> {file.description ?? file.fileName}</p>
                    </div>

                    {/* <i className="bi bi-download file-download-icon" role="button"
                      title="Download file" onClick={() => window.open(file.fileUrl, "_blank")}></i> */}

                       <i
                        className="bi bi-download file-download-icon"
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
             ) ))}

            </Card>
          </Col>
        </Row>

        <div className="text-center mt-4">
          <button onClick={() => navigate("/contact-us")} className="support-btn">{downloads.footer.supportButtonText}</button>
        </div>
      </Container>
    </div>
  );
};

export default Downloads;
