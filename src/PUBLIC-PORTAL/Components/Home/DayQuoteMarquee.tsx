import { useEffect, useState } from "react";
import type { DayQuote } from "../../../ADMIN-PORTAL/Types/CMS/DayQuote.types";
import DayQuotePublicService from "../../Services/DayQuotePublic.services";
import "../../Style/DayQuoteMarquee.css";

const DayQuoteMarquee = () => {
  const [quote, setQuote] = useState<DayQuote | null>(null);

  useEffect(() => {
    DayQuotePublicService.getLastQuote().then(setQuote).catch(console.error);
  }, []);

  if (!quote) return null;

  const text = `✦  Quote of the Day:  "${quote.toDayQuote}"  ✦  Quote of the Day:  "${quote.toDayQuote}"`;

  return (
    <div
      style={{
        background: "#1a2a5e",
        borderTop: "2px solid #f0c040",
        borderBottom: "2px solid #f0c040",
        padding: "10px 0",
        overflow: "hidden",
        whiteSpace: "nowrap",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
          animation: "marqueeScroll 30s linear infinite",
        }}
      >
        <style>{`
          @keyframes marqueeScroll {
            0%   { transform: translateX(100vw); }
            100% { transform: translateX(-100%); }
          }
        `}</style>
        <span style={{ color: "#f0c040", fontSize: "14px", fontStyle: "italic" }}>
          {text}
        </span>
      </div>
    </div>
  );
};

export default DayQuoteMarquee;