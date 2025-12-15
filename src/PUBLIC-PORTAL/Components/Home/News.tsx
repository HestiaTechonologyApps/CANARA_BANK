import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { HiOutlineCalendar, HiOutlineArrowRight } from "react-icons/hi";
import "../../Style/Home/News.css";
import { useNavigate } from "react-router-dom";

const newsItems = [
  {
    date: "December 2025",
    title: "Mass Organizations takes out marches to Parliament",
    excerpt:
      "Including AIBEA on Trade Union rights, minimum wages, commodities, corruption at high places etc. 2000 - BMs",
  },
  {
    date: "November 2025",
    title: "Annual General Meeting Announced",
    excerpt:
      "All members are invited to attend the upcoming AGM scheduled for next month in Thiruvananthapuram.",
  },
  {
    date: "October 2025",
    title: "Claims Settlement Update",
    excerpt:
      "Over 200 claims successfully processed this quarter, benefiting families across Kerala.",
  },
];

const NewsSection: React.FC = () => {
    const navigate = useNavigate()
  return (
    <section className="py-5 news-section">
      <Container>
        <Row className="gy-4">
          {/* LEFT SIDE - NEWS LIST */}
          <Col lg={8}>
            <div className="mb-4">
              <span className="news-label">Stay Informed</span>
              <h2 className="news-heading">Latest News & Updates</h2>
            </div>

            <Row className="gy-3">
              {newsItems.map((item, index) => (
                <Col xs={12} key={index}>
                  <Card className="news-card shadow-sm border-0 p-3">
                    <div className="d-flex align-items-center gap-2 text-warning mb-2">
                      <HiOutlineCalendar size={18} />
                      <span className="news-date">{item.date}</span>
                    </div>

                    <h5 className="news-title">{item.title}</h5>
                    <p className="news-text">{item.excerpt}</p>
                  </Card>
                </Col>
              ))}
            </Row>

            <Button variant="warning"  onClick={() => navigate("/news")} className="mt-4 d-flex align-items-center gap-2 text-white">
              View All News
              <HiOutlineArrowRight />
            </Button>
          </Col>

          {/* RIGHT SIDE - SIDEBAR */}
          <Col lg={4} className="sidebar-wrapper">
            {/* Gold Box */}
            <Card className="p-4 border-0 sidebar-gold shadow-sm">
              <h4 className="mb-3 fw-bold">Every Day is an AIBEA Day</h4>
              <p className="mb-4">
                We salute all the members of the Scheme who have joined in a noble task of extending
                a helping hand to the families of our deceased colleagues.
              </p>
              <Button className="sidebar-btn-gold w-100">Join the Movement</Button>
            </Card>

            {/* Blue Quick Links */}
            <Card className="p-4 border-0 sidebar-blue text-white mt-4 shadow-sm">
              <h4 className="mb-3 fw-bold">Quick Links</h4>
              <ul className="list-unstyled sidebar-links">
                <li>
                  <a className="sidebar-link" href="#downloads">
                    <HiOutlineArrowRight /> Download Forms
                  </a>
                </li>
                <li>
                  <a className="sidebar-link" href="#claims">
                    <HiOutlineArrowRight /> View Claims Status
                  </a>
                </li>
                <li>
                  <a className="sidebar-link" href="#rules">
                    <HiOutlineArrowRight /> Rules & Regulations
                  </a>
                </li>
                <li>
                  <a className="sidebar-link" href="#committee">
                    <HiOutlineArrowRight /> Managing Committee
                  </a>
                </li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default NewsSection;
