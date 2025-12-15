import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import "../Style/NewsPage.css";

const allNewsItems = [
  {
    date: "December 2025",
    title: "Mass Organizations takes out marches to Parliament",
    excerpt:
      "Including AIBEA on Trade Union rights, minimum wages, commodities, corruption at high places etc. 2000 - BMs participated in the historic march demanding better rights for workers.",
  },
  {
    date: "November 2025",
    title: "Annual General Meeting Announced",
    excerpt:
      "All members are invited to attend the upcoming AGM scheduled for next month in Thiruvananthapuram. Important decisions regarding the scheme will be discussed.",
  },
  {
    date: "October 2025",
    title: "Claims Settlement Update",
    excerpt:
      "Over 200 claims successfully processed this quarter, benefiting families across Kerala. The committee has worked tirelessly to ensure timely settlements.",
  },
  {
    date: "September 2025",
    title: "New Member Registration Drive",
    excerpt:
      "Special registration drive conducted across all branches. Over 150 new members joined the scheme this month.",
  },
  {
    date: "August 2025",
    title: "Golden Jubilee Celebrations Begin",
    excerpt:
      "Marking 50 years of dedicated service to our bank family. Various events planned throughout the year.",
  },
  {
    date: "July 2025",
    title: "Committee Meeting Highlights",
    excerpt:
      "The managing committee met to discuss welfare measures and scheme improvements. Several new initiatives were approved.",
  },
  {
    date: "June 2025",
    title: "Health Camp for Members",
    excerpt:
      "Free health checkup camp organized for all members and their families at the main office premises.",
  },
  {
    date: "May 2025",
    title: "Digital Services Launch",
    excerpt:
      "New online portal launched for easy access to forms, claim status, and member information.",
  },
];

const News: React.FC = () => {
  return (
    <div className="news-page">
      {/* Hero Section */}
      <section className="news-hero">
        <Container>
          <span className="news-tag">Stay Informed</span>
          <h1 className="news-title text-white">News & Updates</h1>
          <p className="news-subtext">
            Stay updated with the latest news, announcements, and activities
            from the Golden Jubilee Family Welfare Scheme.
          </p>
        </Container>
      </section>

      {/* Breadcrumb */}
      <div className="news-breadcrumb">
        <Container>
          <span>
            <Link to="/" className="breadcrumb-link">
              Home
            </Link>{" "}
            › <span className="breadcrumb-active">News & Updates</span>
          </span>
        </Container>
      </div>

      {/* News Cards Grid */}
      <section className="news-section">
        <Container>
          <Row className="g-4">
            {allNewsItems.map((item, index) => (
              <Col key={index} md={6} lg={4}>
                <Card className="news-card">
                  <Card.Body>
                    <div className="news-date">
                      <Calendar size={18} className="news-calendar-icon" />
                      <span>{item.date}</span>
                    </div>

                    <h5 className="news-heading">{item.title}</h5>

                    <p className="news-excerpt">{item.excerpt}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default News;
