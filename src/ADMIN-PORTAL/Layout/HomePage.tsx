import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import KiduSearchBar from "../../Components/KiduSearchBar";
import KiduButton from "../../Components/KiduButton";
import KiduLoader from "../../Components/KiduLoader";
import KiduCard from "../../Components/KiduCard";
import { useYear } from "./YearContext";

interface CardData {
  title: string;
  value: number;
  change: number;
  color: string;
  route: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { selectedYear } = useYear();

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        setLoading(true);
        const mockData: CardData[] = [
          { title: "Total Users", value: 150, change: 12, color: "#4CAF50", route: "/dashboard/users" },
          { title: "Total Staff", value: 25, change: 5, color: "#2196F3", route: "/dashboard/staff/staff-list" },
          { title: "Active Sessions", value: 45, change: -3, color: "#FF9800", route: "/dashboard/sessions" },
          { title: "Revenue", value: 12500, change: 8, color: "#9C27B0", route: "/dashboard/revenue" }
        ];
        setCards(mockData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Error fetching dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchCardData();
  }, [selectedYear]);

  const handleSearch = async (term: string) => {
    if (!term) {
      toast.error("Please enter a search term.");
      return;
    }
    try {
      toast.info(`Searching for: ${term}`);
    } catch (error) {
      console.error("Error searching:", error);
      toast.error("Error performing search.");
    }
  };

  return (
    <>
      <div className="d-flex flex-column p-3">
        <div className="d-flex justify-content-between flex-column flex-md-row align-items-stretch gap-2 mt-3">
          <KiduSearchBar onSearch={handleSearch}/>
          <KiduButton 
            label={
              <div className="d-flex align-items-center gap-2" style={{ textDecoration: "none" }}>
                <FaPlus className="fw-bold" />
                <span className="head-font mt-1">Add New</span>
              </div>
            }
            to="/dashboard/create"
            style={{ width: 200 }}
          />
        </div>

        <Container fluid className="mt-4 px-0">
          <Row className="g-2 justify-content-start mb-2">
            <h6 className="fw-medium mb-3 text-start head-font" style={{ color: "gray" }}>
              Overview
            </h6>

            {loading ? (
              <div className="d-flex justify-content-center align-items-center w-100 mt-3">
                <KiduLoader type="..." />
              </div>
            ) : (
              cards.map((card, idx) => (
                <Col xs={6} sm={6} md={4} lg={3} xl={2} key={idx} className="d-flex">
                  <KiduCard 
                    title={card.title}
                    value={card.value}
                    change={card.change}
                    color={card.color}
                    onClick={() => navigate(card.route)}
                  />
                </Col>
              ))
            )}
          </Row>
        </Container>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default HomePage;
