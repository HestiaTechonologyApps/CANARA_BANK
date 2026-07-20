// KiduTableFilter.tsx - Reusable filter component for tables
import React, { useState, useEffect } from "react";
import { Dropdown, Badge, Form, Button, Row, Col } from "react-bootstrap";
import { FaFilter, FaTimes } from "react-icons/fa";

export interface FilterColumn {
    key: string;
    label: string;
    type?: 'text' | 'select' | 'date' | 'number';
    options?: Array<{ value: string; label: string }>; // For select type
    placeholder?: string;
}

interface KiduTableFilterProps {
    columns: FilterColumn[];
    onFilterChange: (filters: Record<string, any>) => void;
    initialFilters?: Record<string, any>;
}

const KiduTableFilter: React.FC<KiduTableFilterProps> = ({
    columns,
    onFilterChange,
    initialFilters = {},
}) => {
    const [filters, setFilters] = useState<Record<string, any>>(initialFilters);
    const [show, setShow] = useState(false);

    // Count active filters
    const activeFilterCount = Object.values(filters).filter(
        (value) => value !== "" && value !== null && value !== undefined
    ).length;

    // Update parent when filters change
    useEffect(() => {
        onFilterChange(filters);
    }, [filters, onFilterChange]);

    const handleFilterChange = (key: string, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleClearAll = () => {
        const clearedFilters: Record<string, any> = {};
        columns.forEach((col) => {
            clearedFilters[col.key] = "";
        });
        setFilters(clearedFilters);
    };

    const renderFilterInput = (column: FilterColumn) => {
        const value = filters[column.key] || "";

        switch (column.type) {
            case "select":
                return (
                    <Form.Select
                        size="sm"
                        value={value}
                        onChange={(e) => handleFilterChange(column.key, e.target.value)}
                        style={{
                            fontFamily: "Urbanist",
                            fontSize: "13px",
                            borderColor: "#1B3763",
                        }}
                    >
                        <option value="">All</option>
                        {column.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </Form.Select>
                );

            case "date":
                return (
                    <Form.Control
                        type="date"
                        size="sm"
                        value={value}
                        onChange={(e) => handleFilterChange(column.key, e.target.value)}
                        style={{
                            fontFamily: "Urbanist",
                            fontSize: "13px",
                            borderColor: "#1B3763",
                        }}
                    />
                );

            case "number":
                return (
                    <Form.Control
                        type="number"
                        size="sm"
                        placeholder={column.placeholder || `Filter ${column.label}...`}
                        value={value}
                        onChange={(e) => handleFilterChange(column.key, e.target.value)}
                        style={{
                            fontFamily: "Urbanist",
                            fontSize: "13px",
                            borderColor: "#1B3763",
                        }}
                    />
                );

            case "text":
            default:
                return (
                    <Form.Control
                        type="text"
                        size="sm"
                        placeholder={column.placeholder || `Filter ${column.label}...`}
                        value={value}
                        onChange={(e) => handleFilterChange(column.key, e.target.value)}
                        style={{
                            fontFamily: "Urbanist",
                            fontSize: "13px",
                            borderColor: "#1B3763",
                        }}
                    />
                );
        }
    };

    return (
        <Dropdown show={show} onToggle={setShow}>
            <Dropdown.Toggle
                size="sm"
                variant="outline"
                style={{
                    color: "#1B3763",
                    fontFamily: "Urbanist",
                    fontSize: "13px",
                    fontWeight: 600,
                    borderColor: "#1B3763",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                }}
            >
                <FaFilter />
                Filters
                {activeFilterCount > 0 && (
                    <Badge
                        bg="danger"
                        pill
                        style={{
                            fontSize: "10px",
                            marginLeft: "4px",
                        }}
                    >
                        {activeFilterCount}
                    </Badge>
                )}
            </Dropdown.Toggle>

            <Dropdown.Menu
                style={{
                    minWidth: "700px",
                    maxWidth: "900px",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
            >
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6
                        className="mb-0"
                        style={{
                            fontFamily: "Urbanist",
                            fontWeight: 600,
                            color: "#1B3763",
                        }}
                    >
                        Filter Options
                    </h6>
                    {activeFilterCount > 0 && (
                        <Button
                            size="sm"
                            variant="link"
                            onClick={handleClearAll}
                            style={{
                                color: "#dc3545",
                                textDecoration: "none",
                                fontFamily: "Urbanist",
                                fontSize: "13px",
                                fontWeight: 600,
                            }}
                        >
                            <FaTimes className="me-1" />
                            Clear All
                        </Button>
                    )}
                </div>

                <Row className="g-3">
                    {columns.map((column) => (
                        <Col xs={12} md={6} lg={4} key={column.key}>
                            <Form.Group>
                                <Form.Label
                                    style={{
                                        fontFamily: "Urbanist",
                                        fontSize: "12px",
                                        fontWeight: 600,
                                        color: "#1B3763",
                                        marginBottom: "6px",
                                    }}
                                >
                                    {column.label}
                                </Form.Label>
                                {renderFilterInput(column)}
                            </Form.Group>
                        </Col>
                    ))}
                </Row>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default KiduTableFilter;