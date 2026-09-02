import React, { useEffect, useState } from "react";
import MemberService from "../../../Services/Contributions/Member.services";
import type { MemberStatus } from "../../../Types/Contributions/Member.types";

const THEME_COLOR = "#1B3763";

interface MemberStatusCardsProps {
  selectedStatusId: number | null;
  onSelect: (statusId: number | null) => void;
}

const MemberStatusCards: React.FC<MemberStatusCardsProps> = ({ selectedStatusId, onSelect }) => {
  const [statuses, setStatuses] = useState<MemberStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    MemberService.getStatusFilters()
      .then(setStatuses)
      .finally(() => setLoading(false));
  }, []);

  const handleClick = (statusId: number | null) => {
    onSelect(selectedStatusId === statusId ? null : statusId);
  };

  const cardStyle = (isActive: boolean): React.CSSProperties => ({
    cursor: "pointer",
    minWidth: 100,
    padding: "8px 16px",
    borderRadius: 20,
    border: `1.5px solid ${isActive ? THEME_COLOR : "#e2e8f0"}`,
    background: isActive ? THEME_COLOR : "#fff",
    color: isActive ? "#fff" : "#475569",
    fontFamily: "Urbanist",
    fontWeight: 600,
    fontSize: 13,
    textAlign: "center",
    transition: "all 0.15s",
  });

  return (
    <div
      className="mb-3 p-3"
      style={{
        background: "#f8fafc",
        border: "1.5px solid #e8edf5",
        borderRadius: 12,
      }}
    >
      <div className="d-flex align-items-center gap-2 mb-2">
        <span style={{ fontSize: 16 }}>🔎</span>
        <span
          style={{
            fontFamily: "Urbanist",
            fontWeight: 800,
            fontSize: 13,
            color: THEME_COLOR,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Filter by Status
        </span>
        {selectedStatusId !== null && (
          <button
            onClick={() => onSelect(null)}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              color: "#64748b",
              fontFamily: "Urbanist",
              fontWeight: 600,
              fontSize: 12,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Clear filter
          </button>
        )}
      </div>

      <div className="d-flex flex-wrap gap-2">
        <div style={cardStyle(selectedStatusId === null)} onClick={() => handleClick(null)}>
          All
        </div>

        {loading && (
          <div className="d-flex align-items-center text-muted" style={{ fontSize: 13 }}>
            Loading statuses…
          </div>
        )}

        {statuses.map((s) => (
          <div
            key={s.statusId}
            style={cardStyle(selectedStatusId === s.statusId)}
            onClick={() => handleClick(s.statusId)}
          >
            {s.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberStatusCards;