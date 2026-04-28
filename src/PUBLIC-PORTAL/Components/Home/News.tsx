import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { HiOutlineCalendar, HiOutlineArrowRight } from "react-icons/hi";
import "../../Style/Home/News.css";
import { Link, useNavigate } from "react-router-dom";
import DayQuotePublicService from "../../Services/DayQuotePublic.services";
import type { DayQuote } from "../../../ADMIN-PORTAL/Types/CMS/DayQuote.types";
import type { DailyNews } from "../../../ADMIN-PORTAL/Types/CMS/DailyNews.types";
import DailyNewsPublicService from "../../Services/DailyNewsPublic.services";
import PublicPageConfigService from "../../Services/Publicpage.services";
import type { PublicPage } from "../../../ADMIN-PORTAL/Types/CMS/PublicPage.types";

interface QuickLink {
  label: string;
  route: string;
}

const NewsSection: React.FC = () => {
  const navigate = useNavigate();
  const [dayQuote, setDayQuote] = useState<DayQuote | null>(null);
  const [latestNews, setLatestNews] = useState<DailyNews[]>([]);
  const [config, setConfig] = useState<PublicPage | null>(null);
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        // CMS config
        const data = await PublicPageConfigService.getPublicPageConfig();
        const activeConfig = data.find(
          (item: PublicPage) => item.isActive === true
        );
        setConfig(activeConfig || null);

        if (activeConfig?.newsQuickLinksJson) {
          setQuickLinks(JSON.parse(activeConfig.newsQuickLinksJson));
        }

        // Try to get today's DayQuote
        try {
          const quote = await DayQuotePublicService.getLastQuote();
          setDayQuote(quote || null);
        } catch {
          setDayQuote(null);
        }

        // Get last 3 news
        const latestThree = await DailyNewsPublicService.getLatestThreeNews();
        setLatestNews(latestThree);
      } catch (error) {
        console.error("Error loading home page data:", error);
      }
    };

    loadHomeData();
  }, []);

  // Quote title: DayQuote first, then CMS fallback
  const quoteTitle = dayQuote?.toDayQuote || config?.newsSidebarQuoteTitle || "Every Day is an AIBEA Day";
  const quoteBody = dayQuote?.unformatedContent || config?.newsSidebarQuoteText || "We salute all the members of the Scheme who have joined in the noble task of extending a helping hand to fellow members and their families";

  return (
    <section className="py-5 news-section">
      <Container>
        <Row className="gy-4">
          {/* LEFT SIDE - NEWS LIST */}
          <Col lg={8}>
            <div className="mb-4">
              <span className="news-label">
                {config?.newsSectionHeadingLabel || "Stay Informed"}
              </span>
              <h2 className="news-heading fs-3">
                {config?.newsSectionHeadingTitle || "Latest News & Updates"}
              </h2>
            </div>

            <Row className="gy-3">
              {latestNews.map((item, index) => (
                <Col xs={12} key={index}>
                  <Card className="news-card shadow-sm border-0 p-3">
                    <div className="d-flex align-items-center gap-2 text-warning mb-2">
                      <HiOutlineCalendar size={18} />
                      <span className="news-date">
                        {item.newsDateString?.split(" ").slice(0, 3).join(" ")}
                      </span>
                    </div>
                    <h6 className="news-title fs-5">{item.title}</h6>
                    <p className="news-text">
                      {item.description?.length > 150
                        ? item.description.slice(0, 150) + "..."
                        : item.description}
                    </p>
                  </Card>
                </Col>
              ))}
            </Row>

            <Button
              variant="warning"
              onClick={() => navigate("/news")}
              className="mt-4 d-flex align-items-center gap-2 text-white"
            >
              {config?.newsTag || "View All News"}
              <HiOutlineArrowRight />
            </Button>
          </Col>

          {/* RIGHT SIDE - SIDEBAR */}
          <Col lg={4} className="sidebar-wrapper">
            {/* Gold Box */}
            {(quoteTitle || quoteBody) && (
              <Card className="p-4 border-0 sidebar-gold shadow-sm">
                {quoteTitle && (
                  <h4 className="mb-3 fw-bold fs-5 text-center bg-white px-1 py-2 rounded border-start border-primary border-5">
                    {quoteTitle}
                  </h4>
                )}
                {quoteBody && (
                  <p className="mb-4">{quoteBody}</p>
                )}
              </Card>
            )}

            {/* Blue Quick Links */}
            <Card className="p-4 border-0 sidebar-blue text-white mt-4 shadow-sm">
              <h4 className="mb-3 fw-bold">
                {config?.newsSectionQuickLinksHead}
              </h4>
              <ul className="list-unstyled sidebar-links">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link className="sidebar-link" to={link.route}>
                      <HiOutlineArrowRight /> {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default NewsSection;