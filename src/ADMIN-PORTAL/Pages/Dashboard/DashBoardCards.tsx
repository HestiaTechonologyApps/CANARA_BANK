import React from "react";
import { Card } from "react-bootstrap";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

interface KiduCardProps {
  title: string;
  value: number;
  change: number;
  color?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

const DashBoardCards: React.FC<KiduCardProps> = ({
  title,
  value,
  change,
  onClick,
  icon,
}) => {
  const isPositive = change >= 0;

  return (
    <Card
      onClick={onClick}
      className="w-100 border-0 shadow-sm overview-card"
      style={{
        cursor: "pointer",
        borderRadius: "10px",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <Card.Body className="p-3 d-flex align-items-center gap-3">
        {/* Icon */}
        {icon && (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: 44,
              height: 44,
              borderRadius: "10px",
              backgroundColor: "#f1f5f9",
              color: "#0f2a55",
              fontSize: "1.4rem",
            }}
          >
            {icon}
          </div>
        )}

        {/* Content */}
        <div className="flex-grow-1">
          <p className="mb-1 text-muted" style={{ fontSize: "13px" }}>
            {title}
          </p>

          <div className="d-flex align-items-center gap-2">
            <h4 className="mb-0 fw-bold">
              {value.toLocaleString()}
            </h4>

            <span
              className="d-flex align-items-center gap-1 px-2 py-1"
              style={{
                fontSize: "12px",
                borderRadius: "12px",
                backgroundColor: isPositive ? "#e7f7ee" : "#fdecec",
                color: isPositive ? "#16a34a" : "#dc2626",
              }} >
              {isPositive ? (
                <FaArrowTrendUp size={12} />
              ) : (
                <FaArrowTrendDown size={12} />
              )}
              {isPositive ? "+" : ""}
              {change}%
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DashBoardCards;
