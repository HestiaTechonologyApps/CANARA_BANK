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
    minWidth: 120,
    padding: "10px 16px",
    borderRadius: 10,
    border: `1.5px solid ${isActive ? THEME_COLOR : "#e2e8f0"}`,
    background: isActive ? THEME_COLOR : "#fff",
    color: isActive ? "#fff" : "#1e293b",
    fontFamily: "Urbanist",
    fontWeight: 700,
    fontSize: 13,
    textAlign: "center",
    transition: "all 0.15s",
  });

  return (
    <div className="d-flex flex-wrap gap-2 mb-3">
      <div className="shadow-sm" style={cardStyle(selectedStatusId === null)} onClick={() => handleClick(null)}>
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
          className="shadow-sm"
          style={cardStyle(selectedStatusId === s.statusId)}
          onClick={() => handleClick(s.statusId)}
        >
          {s.name}
        </div>
      ))}
    </div>
  );
};

export default MemberStatusCards;