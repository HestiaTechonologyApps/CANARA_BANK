import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Calendar } from "lucide-react";
import "../Style/NewsPage.css";
import type { DailyNews } from "../../ADMIN-PORTAL/Types/CMS/DailyNews.types";
import DailyNewsPublicService from "../Services/DailyNewsPublic.services";
import type { PublicPage } from "../../ADMIN-PORTAL/Types/CMS/PublicPage.types";
import PublicPageConfigService from "../Services/Publicpage.services";

const News: React.FC = () => {
  const [newsItems, setNewsItems] = useState<DailyNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<PublicPage | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        //  CMS config (ACTIVE ONLY)
        const data = await PublicPageConfigService.getPublicPageConfig();
        const activeConfig = data.find(
          (item: PublicPage) => item.isActive === true
        );
        setConfig(activeConfig || null);

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
          <span className="news-tag"> {config?.newsSectionHeadingLabel}</span>
          <h1 className="news-title text-white"> {config?.newsHeroTitle}</h1>
          <p className="news-subtext">
            {config?.newsHeroSubTitle}
          </p>
        </Container>
      </section>
      {/* News Cards Grid */}
      <section className="news-section">
        <Container>
          {loading ? (
            <div className="text-center py-5 news-loader">
              <div className="loader-icon mb-3">
                <span className="pulse-icon">⏳</span>
              </div>
              <h5 className="mb-1">Loading</h5>
              <p className="text-muted small">Please wait a moment…</p>
            </div>
          ) : newsItems.length === 0 ? (
            <div className="text-center py-5">
              <p>{config?.newsEmptyText}.</p>
            </div>
          ) : (
            <Row className="g-4">
              {newsItems.map((item, index) => (
                <Col key={index} md={6} lg={4}>
                  <Card className="news-card">
                    <Card.Body>
                      <div className="news-date">
                        <Calendar size={18} className="news-calendar-icon" />
                        <span className="news-date">
                          {item.newsDateString?.split(" ").slice(0, 3).join(" ")}
                        </span>
                      </div>
                      <h5 className="news-heading">{item.title}</h5>
                      <p className="news-excerpt">
                        {item.description?.length > 250 ? item.description.slice(0, 250) + "..." : item.description}
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
