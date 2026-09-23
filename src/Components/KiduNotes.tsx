import React from "react";

interface KiduNoteProps {
  message: string;
}

const KiduNote: React.FC<KiduNoteProps> = ({ message }) => {
  return (
    <div
      className="rounded-3 pt-3 mt-3 p-3 mb-3 shadow-sm"
      style={{
        backgroundColor: "#EFF6FF", 
        borderLeft: "5px solid #3B82F6", 
        color: "#1E3A8A", 
        fontFamily: "Urbanist",
        fontSize: "0.95rem",
       
      }}
    >
      <strong>Note:</strong> {message}
    </div>
  );
};

export default KiduNote;
