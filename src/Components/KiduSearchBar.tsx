import React, { useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { FaSearch, FaTimes } from "react-icons/fa";

interface KiduSearchBarProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  width?: string;
}

const KiduSearchBar: React.FC<KiduSearchBarProps> = ({
  placeholder = "Search...",
  onSearch,
  width = "400px",
}) => {
  const [value, setValue] = useState("");

  const handleSearch = () => {
    onSearch(value.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <div style={{ width, maxWidth: "100%" }} className="mb-3">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{
            borderRight: "none",
            borderColor: "#dee2e6",
            boxShadow: "none",
            fontFamily: "Urbanist",
          }}
        />
 {value && (
          <Button
            onClick={handleClear}
            style={{
              backgroundColor: "#fff",
              border: "1px solid #dee2e6",
              borderLeft: "none",
              borderRight: "none",
              color: "#6c757d",
            }}
            title="Clear search"
          >
            <FaTimes size={13} className="mb-1" />
          </Button>
        )}

        <Button
          onClick={handleSearch}
          style={{
            backgroundColor: "#1B3763",
            border: "none",
            color: "white",
            // paddingLeft: "1rem",
            // paddingRight: "1rem",
          }}
        >
          <FaSearch size={13} className="mb-1"/>
        </Button>
      </InputGroup>
    </div>
  );
};

export default KiduSearchBar;
