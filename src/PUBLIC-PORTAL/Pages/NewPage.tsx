import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import "../Style/NewsPage.css";
import type { DailyNews } from "../../ADMIN-PORTAL/Types/CMS/DailyNews.types";
import DailyNewsPublicService from "../Services/DailyNewsPublic.services";
import { PublicService } from "../../Services/PublicService";
// ================NEW FIELDS NEED TO BE ADDED FROM API============
const News: React.FC = () => {
  const news = PublicService.newsPage
  const [newsItems, setNewsItems] = useState<DailyNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        // Get last 9 added news (filtered and sorted by createdOn)
        const latestNine = await DailyNewsPublicService.getLatestNineNews();
        setNewsItems(latestNine);
      } catch (error) {
        console.error("Error loading news:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  return (
    <div className="news-page">
      {/* Hero Section */}
      <section className="news-hero text-center py-4">
        <Container>
          <span className="news-tag">{news.hero.tag}</span>
          <h1 className="news-title text-white">{news.hero.title}</h1>
          <p className="news-subtext">
            {news.hero.subtitle}
          </p>
        </Container>
      </section>
      {/* Breadcrumb */}
      <div className="news-breadcrumb">
        <Container>
          <span>
            <Link to="/" className="breadcrumb-link">
              {news.breadcrumb.homeLabel}
            </Link>{" "}
            › <span className="breadcrumb-active">{news.breadcrumb.currentLabel}</span>
          </span>
        </Container>
      </div>
      {/* News Cards Grid */}
      <section className="news-section">
        <Container>
          {loading ? (
            <div className="text-center py-5">
              <p>{news.states.loadingText}</p>
            </div>
          ) : newsItems.length === 0 ? (
            <div className="text-center py-5">
              <p>{news.states.emptyText}.</p>
            </div>
          ) : (
            <Row className="g-4">
              {newsItems.map((item, index) => (
                <Col key={index} md={6} lg={4}>
                  <Card className="news-card">
                    <Card.Body>
                      <div className="news-date">
                        <Calendar size={18} className="news-calendar-icon" />
                        <span>{item.newsDateString}</span>
                      </div>
                      <h5 className="news-heading">{item.title}</h5>
                      <p className="news-excerpt">
                        {item.description?.length > 150 ? item.description.slice(0, 150) + "..." : item.description}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
    </div>
  );
};

export default News;
