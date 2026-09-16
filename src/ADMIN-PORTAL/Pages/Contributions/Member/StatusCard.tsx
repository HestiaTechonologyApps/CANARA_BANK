import React, { useEffect, useState } from "react";
import MemberService from "../../../Services/Contributions/Member.services";
import type { MemberStatus } from "../../../Types/Contributions/Member.types";

const THEME_COLOR = "#1B3763";
const THEME_COLOR_SOFT = "#EEF2F9";

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

  const pillStyle = (isActive: boolean): React.CSSProperties => ({
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    minWidth: 90,
    justifyContent: "center",
    padding: "7px 16px",
    borderRadius: 999,
    border: `1.5px solid ${isActive ? THEME_COLOR : "#e2e8f0"}`,
    background: isActive ? THEME_COLOR : "#fff",
    color: isActive ? "#fff" : "#475569",
    fontFamily: "Urbanist",
    fontWeight: 600,
    fontSize: 13,
    lineHeight: 1,
    textAlign: "center",
    boxShadow: isActive ? "0 2px 8px rgba(27,55,99,0.25)" : "none",
    transition: "all 0.18s ease",
  });

  const skeletonStyle: React.CSSProperties = {
    width: 90,
    height: 32,
    borderRadius: 999,
    background: "linear-gradient(90deg, #e8edf5 25%, #f4f7fb 50%, #e8edf5 75%)",
    backgroundSize: "200% 100%",
    animation: "statusPulse 1.3s ease-in-out infinite",
  };

  return (
    <div
      className="mb-3 p-3"
      style={{
        background: "#f8fafc",
        border: "1.5px solid #e8edf5",
        borderRadius: 12,
      }}
    >
      <style>{`
        @keyframes statusPulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .status-pill:hover:not(.status-pill-active) {
          border-color: ${THEME_COLOR} !important;
          background: ${THEME_COLOR_SOFT} !important;
        }
      `}</style>

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
        <button
          type="button"
          className={`status-pill${selectedStatusId === null ? " status-pill-active" : ""}`}
          style={pillStyle(selectedStatusId === null)}
          onClick={() => handleClick(null)}
        >
          {selectedStatusId === null && <span aria-hidden>✓</span>}
          All
        </button>

        {loading &&
          Array.from({ length: 4 }).map((_, i) => <div key={i} style={skeletonStyle} />)}

        {!loading &&
          statuses.map((s) => {
            const isActive = selectedStatusId === s.statusId;
            return (
              <button
                type="button"
                key={s.statusId}
                className={`status-pill${isActive ? " status-pill-active" : ""}`}
                style={pillStyle(isActive)}
                onClick={() => handleClick(s.statusId)}
              >
                {isActive && <span aria-hidden>✓</span>}
                {s.name}
              </button>
            );
          })}
      </div>
    </div>
  );
};

export default MemberStatusCards;