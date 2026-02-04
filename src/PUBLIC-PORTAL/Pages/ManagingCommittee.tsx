import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../Style/ManagingCommittee.css";
import type { ManagingCommittee } from "../../ADMIN-PORTAL/Types/CMS/ManagingCommittee.types";
import PublicManagingCommitteeService from "../Services/ManagingCommiteePublic.services";
import { API_BASE_URL } from "../../CONSTANTS/API_ENDPOINTS";
import type { PublicPage } from "../../ADMIN-PORTAL/Types/CMS/PublicPage.types";
import PublicPageConfigService from "../Services/Publicpage.services";

const ManagingCommitteePublic: React.FC = () => {

  // const managingCommittee = PublicService.managingCommittee
  const [config, setConfig] = useState<PublicPage | null>(null);
  const [members, setMembers] = useState<ManagingCommittee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManagingCommittee = async () => {
      try {
        // CMS page config (ACTIVE only)
        const configData = await PublicPageConfigService.getPublicPageConfig();
        const activeConfig = configData.find(
          (item: PublicPage) => item.isActive === true
        );
        setConfig(activeConfig || null);
        const data = await PublicManagingCommitteeService.getManagingCommittee();

        // DEBUG: Log the data to see imageLocation format
        console.log('Managing Committee Data:', data);
        console.log('API_BASE_URL:', API_BASE_URL);

        // sort by order ASC
        const sortedData = [...data].sort(
          (a, b) => a.order - b.order
        );

        setMembers(sortedData);
      } catch (error) {
        console.error("Failed to load managing committee", error);
      } finally {
        setLoading(false);
      }
    };

    fetchManagingCommittee();
  }, []);

  //helper function to construct image URL
  const getImageUrl = (imageLocation: string | null | undefined): string => {
    if (!imageLocation) {
      console.log('No imageLocation provided');
      return '';
    }

    console.log('Original imageLocation:', imageLocation);

    // If it's already a full URL, return as is
    if (imageLocation.startsWith('http://') || imageLocation.startsWith('https://')) {
      console.log('Full URL detected:', imageLocation);
      return imageLocation;
    }

    // Construct URL from base
    let baseUrl = API_BASE_URL;

    // Remove /api from the end if it exists
    baseUrl = baseUrl.replace(/\/api\/?$/, '');

    // Ensure imageLocation starts with /
    const path = imageLocation.startsWith('/') ? imageLocation : '/' + imageLocation;

    const finalUrl = `${baseUrl}${path}`;
    console.log('Constructed URL:', finalUrl);

    return finalUrl;
  };

  return (
    <div className="committee-wrapper">

      {/* HEADER SECTION */}
      <div className="committee-header text-center py-4">
        <h2 className="committee-title">{config?.committeeHeaderTitle}</h2>
        <p className="committee-subtitle">
          {config?.committeeHeaderSubTitle}
        </p>
      </div>

      <Container className="py-5">
        <Row className="g-4 justify-content-center">
          {
            loading ? (
              <div className="text-center py-5 committe-loader">
                <div className="loader-icon mb-3">
                  <span className="pulse-icon">⏳</span>
                </div>
                <h5 className="mb-1">Loading</h5>
                <p className="text-muted small">Please wait a moment…</p>
              </div>
            ) : (
              members.map((member, index) => {
                const imageUrl = getImageUrl(member.imageLocation);
                return (
                  <Col key={index} lg={4} md={6} sm={12}>
                    <Card className="committee-card p-4 text-center">

                      {/* Placeholder Avatar */}
                      {/* <div className="avatar-circle mx-auto mb-3">
                  <i className="bi bi-person-fill"></i>
                </div> */}

                      {/* Avatar */}
                      {/* <div className="avatar-circle mx-auto mb-3">
                      {member.imageLocation ? (
                        <img
                          src={`${API_BASE_URL
                            .replace('http://', 'https://')
                            .replace('/api', '')}${member.imageLocation}`}
                          alt={member.managingComitteeName}
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <i className="bi bi-person-fill"></i>
                      )}
                    </div> */}

                      <div className="avatar-circle mx-auto mb-3">
                        {imageUrl ? (
                          <>
                            <img
                              src={imageUrl}
                              alt={member.managingComitteeName}
                              style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                              onLoad={(_e) => {
                                console.log('Image loaded successfully:', imageUrl);
                              }}
                              onError={(e) => {
                                console.error('Image failed to load:', imageUrl);
                                console.error('Original imageLocation:', member.imageLocation);
                                e.currentTarget.style.display = 'none';
                                const icon = e.currentTarget.parentElement?.querySelector('i');
                                if (icon) {
                                  icon.classList.remove('d-none');
                                }
                              }}
                            />
                            <i className="bi bi-person-fill d-none"></i>
                          </>
                        ) : (
                          <i className="bi bi-person-fill"></i>
                        )}
                      </div>

                      {/* Member Name */}
                      <h5 className="member-name">{member.managingComitteeName}</h5>

                      {/* Member Role */}
                      <p className="member-role">{member.position}</p>

                      {/* Location */}
                      <p className="member-location">{member.description2}</p>

                      {/* CONTACT INFO */}
                      {/* <div className="contact-info mt-3">
                  <p className="small mb-1">
                    <i className="bi bi-telephone-fill me-2"></i>
                    {member.phone}
                  </p>
                  <p className="small mb-0">
                    <i className="bi bi-envelope-fill me-2"></i>
                    {member.email}
                  </p>
                </div> */}
                    </Card>
                  </Col>
                )
              }))}

        </Row>
      </Container>
    </div>
  );
};

export default ManagingCommitteePublic;
