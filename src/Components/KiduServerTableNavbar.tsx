import React from "react";
import { Row, Col, Dropdown, ButtonGroup } from "react-bootstrap";
import { BsPrinter, BsFiletypeCsv, BsFiletypePdf } from "react-icons/bs";
import { FaColumns, FaCopy, FaDownload, FaFileExcel} from "react-icons/fa";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// ✅ Toastify imports
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { FilterColumn } from "./KiduTableFilter";
import KiduTableFilter from "./KiduTableFilter";

interface KiduServerTableNavbarProps {
  data?: any[];
  columns?: Array<{ key: string; label: string; type?: string }>;
  title?: string;
  showExportButtons?: boolean;
  showRowsPerPageSelector?: boolean;
  rowsPerPage?: number;
  onRowsPerPageChange?: (rows: number) => void;
  rowsPerPageOptions?: number[];
  additionalButtons?: React.ReactNode;
  //Filter props
  showFilter?: boolean;
  filterColumns?: FilterColumn[];
  onFilterChange?: (filters: Record<string, any>) => void;
  initialFilters?: Record<string, any>
}

const KiduServerTableNavbar: React.FC<KiduServerTableNavbarProps> = ({
  data = [],
  columns = [],
  title = "Data",
  showExportButtons = true,
  showRowsPerPageSelector = true,
  rowsPerPage = 10,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50, 100],
  additionalButtons,
  showFilter = true,
  filterColumns = [],
  onFilterChange,
  initialFilters = {},
}) => {
  const cleanCellValue = (value: any, columnType?: string): string => {
    if (value === null || value === undefined || value === "") return "";
    if (typeof value === "boolean") return value ? "Yes" : "No";

    if (columnType === "checkbox") {
      const boolValue =
        typeof value === "boolean"
          ? value
          : typeof value === "string"
            ? value.toLowerCase() === "true" || value === "1"
            : typeof value === "number"
              ? value !== 0
              : false;
      return boolValue ? "Yes" : "No";
    }

    if (columnType === "image") return "";
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value).trim();
  };

  // ✅ Copy to clipboard with Toastify
  const handleCopy = () => {
    if (data.length === 0) return;

    const headers = columns
      .filter((col) => col.type !== "image")
      .map((col) => col.label)
      .join("\t");

    const rows = data
      .map((row) =>
        columns
          .filter((col) => col.type !== "image")
          .map((col) => cleanCellValue(row[col.key], col.type))
          .join("\t")
      )
      .join("\n");

    const textToCopy = `${headers}\n${rows}`;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast.success("Data copied to clipboard", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
        });
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        toast.error("Failed to copy data", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
        });
      });
  };

  const handleCSV = () => {
    if (data.length === 0) return;

    const headers = columns
      .filter((col) => col.type !== "image")
      .map((col) => col.label)
      .join(",");

    const rows = data
      .map((row) =>
        columns
          .filter((col) => col.type !== "image")
          .map((col) => {
            let value = cleanCellValue(row[col.key], col.type);
            if (value.includes(",") || value.includes('"') || value.includes("\n")) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(",")
      )
      .join("\n");

    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title}_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const handleExcel = () => {
    if (data.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(
      data.map((row) => {
        const obj: any = {};
        columns
          .filter((col) => col.type !== "image")
          .forEach((col) => {
            obj[col.label] = cleanCellValue(row[col.key], col.type);
          });
        return obj;
      })
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(
      workbook,
      `${title}_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const handlePDF = () => {
    if (data.length === 0) return;

    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    doc.setFontSize(16);
    doc.text(title, 14, 15);

    const exportColumns = columns.filter(
      (col) => col.type !== "image" && col.type !== "checkbox"
    );

    autoTable(doc, {
      head: [exportColumns.map((c) => c.label)],
      body: data.map((row) =>
        exportColumns.map((c) => cleanCellValue(row[c.key], c.type) || "-")
      ),
      startY: 25,
      styles: { fontSize: 9 },
    });

    doc.save(`${title}_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const handlePrint = () => {
    if (data.length === 0) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const cols = columns.filter((c) => c.type !== "image");
    printWindow.document.write(`
      <html>
        <head><title>${title}</title></head>
        <body onload="window.print();window.close();">
          <h2>${title}</h2>
          <table border="1" width="100%" cellspacing="0" cellpadding="5">
            <thead>
              <tr>${cols.map((c) => `<th>${c.label}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${data
        .map(
          (row) =>
            `<tr>${cols
              .map(
                (c) =>
                  `<td>${cleanCellValue(row[c.key], c.type) || "-"}</td>`
              )
              .join("")}</tr>`
        )
        .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <>
      <Row className="mb-3 align-items-center">
        <Col xs="auto">
          <div className="d-flex gap-2 flex-wrap align-items-center">
            {/* 
             <Dropdown as={ButtonGroup}>
                <Dropdown.Toggle size="sm" variant="outline" style={{color  : "#1B3763", fontFamily: "Urbanist", fontSize: "13px", fontWeight: 600}}>
               <FaFilter/>  Filter
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {rowsPerPageOptions.map((opt) => (
                    <Dropdown.Item
                      key={opt}
                      active={rowsPerPage === opt}
                      onClick={() => onRowsPerPageChange?.(opt)}
                    >
                      {opt} rows
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown> */}

            {showFilter && filterColumns.length > 0 && onFilterChange && (
              <KiduTableFilter
                columns={filterColumns}
                onFilterChange={onFilterChange}
                initialFilters={initialFilters}
              />
            )}
           {showRowsPerPageSelector && (
  <Dropdown as={ButtonGroup}>
       <Dropdown.Toggle size="sm" variant="outline" style={{
      color: "#1B3763",
      fontFamily: "Urbanist",
      fontSize: "13px",
      fontWeight: 600,
      borderColor: "#1B3763",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    }}>
      <FaColumns />  {rowsPerPage === -1 ? "Show All rows" : `Show ${rowsPerPage} rows`}
    </Dropdown.Toggle>
    <Dropdown.Menu style={{
      fontFamily: "Urbanist",
      fontSize: "13px",
      fontWeight: 600,
      border: "1px solid #1B3763",
      borderRadius: "6px",
      boxShadow: "0 4px 10px rgba(27, 55, 99, 0.15)",
      padding: "4px",
      minWidth: "140px",
    }}>
      {rowsPerPageOptions.map((opt) => {
        const isActive = rowsPerPage === opt;
        return (
          <Dropdown.Item
            key={opt}
            active={isActive}
            onClick={() => onRowsPerPageChange?.(opt)}
            style={{
              color: isActive ? "#fff" : "#1B3763",
              backgroundColor: isActive ? "#1B3763" : "transparent",
              borderRadius: "4px",
              fontWeight: isActive ? 700 : 500,
              padding: "6px 10px",
              marginBottom: "2px",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = "#eef2f7";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
                   >
            {opt === -1 ? "All" : `${opt} rows`}
          </Dropdown.Item>
        );
      })}
    </Dropdown.Menu>
  </Dropdown>
)}

            {/* {showExportButtons && (
              <>
                <Button size="sm" variant="secondary" onClick={handleCopy}>
                  <FaCopy /> Copy
                </Button>
                <Button size="sm" variant="secondary" onClick={handleCSV}>
                  <BsFiletypeCsv /> CSV
                </Button>
                <Button size="sm" variant="secondary" onClick={handleExcel}>
                  <FaFileExcel /> Excel
                </Button>
                <Button size="sm" variant="secondary" onClick={handlePDF}>
                  <BsFiletypePdf /> PDF
                </Button>
                <Button size="sm" variant="secondary" onClick={handlePrint}>
                  <BsPrinter /> Print
                </Button>
              </>
            )} */}
            {/* {showExportButtons && (
              <Dropdown as={ButtonGroup}>
                <Dropdown.Toggle size="sm" variant="outline" style={{
                  color: "#1B3763",
                  fontFamily: "Urbanist",
                  fontSize: "13px",
                  fontWeight: 600,
                  borderColor: "#1B3763",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}> */}
                  {/* <FaDownload /> Export
                </Dropdown.Toggle>
                <Dropdown.Menu style={{
                  color: "#1B3763",
                  fontFamily: "Urbanist",
                  fontSize: "13px",
                  fontWeight: 600,
                  borderColor: "#1B3763",
                }}> */}
                  {/* <Dropdown.Item onClick={handleCopy}>
                  <span className="text-primary">  <FaCopy /></span> Copy
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleCSV}>
                   <span className="text-warning"> <BsFiletypeCsv /> </span>CSV
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleExcel}>
                   <span className="text-success"> <FaFileExcel /></span> Excel
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handlePDF}>
                  <span className="text-danger">  <BsFiletypePdf /></span> PDF
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handlePrint}>
                    <BsPrinter /> Print
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )} */}
                        {showExportButtons && (
              <Dropdown as={ButtonGroup}>
                <Dropdown.Toggle size="sm" variant="outline" className="kidu-export-toggle" style={{
                  color: "#1B3763",
                  fontFamily: "Urbanist",
                  fontSize: "13px",
                  fontWeight: 600,
                  borderColor: "#1B3763",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}>
                  <FaDownload /> Export
                </Dropdown.Toggle>
                <Dropdown.Menu className="kidu-export-menu">
                  {/* <Dropdown.Item onClick={handleCopy} className="kidu-export-item">
                    <span className="kidu-export-icon" style={{ background: "#eef2ff", color: "#4f46e5" }}>
                      <FaCopy size={13} />
                    </span>
                    <span>Copy</span>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleCSV} className="kidu-export-item">
                    <span className="kidu-export-icon" style={{ background: "#fef9e7", color: "#c9930a" }}>
                      <BsFiletypeCsv size={14} />
                    </span>
                    <span>CSV</span>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleExcel} className="kidu-export-item">
                    <span className="kidu-export-icon" style={{ background: "#e9f9ef", color: "#1e8e4e" }}>
                      <FaFileExcel size={13} />
                    </span>
                    <span>Excel</span>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handlePDF} className="kidu-export-item">
                    <span className="kidu-export-icon" style={{ background: "#fdeceb", color: "#dc3545" }}>
                      <BsFiletypePdf size={14} />
                    </span>
                    <span>PDF</span>
                  </Dropdown.Item>
                  <Dropdown.Divider className="kidu-export-divider" />
                  <Dropdown.Item onClick={handlePrint} className="kidu-export-item">
                    <span className="kidu-export-icon" style={{ background: "#eef2f7", color: "#1B3763" }}>
                      <BsPrinter size={13} />
                    </span>
                    <span>Print</span>
                  </Dropdown.Item> */}
                                    <Dropdown.Item onClick={handleCopy} className="kidu-export-item">
                    <span className="kidu-export-icon" style={{ background: "#eef2ff", color: "#4f46e5" }}>
                      <FaCopy size={11} />
                    </span>
                    <span>Copy</span>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleCSV} className="kidu-export-item">
                    <span className="kidu-export-icon" style={{ background: "#fef9e7", color: "#c9930a" }}>
                      <BsFiletypeCsv size={12} />
                    </span>
                    <span>CSV</span>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleExcel} className="kidu-export-item">
                    <span className="kidu-export-icon" style={{ background: "#e9f9ef", color: "#1e8e4e" }}>
                      <FaFileExcel size={11} />
                    </span>
                    <span>Excel</span>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handlePDF} className="kidu-export-item">
                    <span className="kidu-export-icon" style={{ background: "#fdeceb", color: "#dc3545" }}>
                      <BsFiletypePdf size={12} />
                    </span>
                    <span>PDF</span>
                  </Dropdown.Item>
                  <Dropdown.Divider className="kidu-export-divider" />
                  <Dropdown.Item onClick={handlePrint} className="kidu-export-item">
                    <span className="kidu-export-icon" style={{ background: "#eef2f7", color: "#1B3763" }}>
                      <BsPrinter size={11} />
                    </span>
                    <span>Print</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}


          </div>
        </Col>

        {additionalButtons && (
          <Col xs="auto" className="ms-auto">
            {additionalButtons}
          </Col>
        )}
      </Row>

            <style>{`
        .kidu-export-menu {
          padding: 4px;
          border-radius: 6px;
          border: 1px solid #1B3763;
          box-shadow: 0 4px 10px rgba(27, 55, 99, 0.15);
          min-width: 140px;
        }
        .kidu-export-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          margin-bottom: 2px;
          border-radius: 4px;
          font-family: 'Urbanist', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #1B3763;
        }
        .kidu-export-item:last-child {
          margin-bottom: 0;
        }
        .kidu-export-item:hover,
        .kidu-export-item:focus {
          background-color: #eef2f7;
          color: #1B3763;
        }
        .kidu-export-icon {
          width: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .kidu-export-divider {
          margin: 4px 2px;
          border-color: #eef1f6;
        }
      `}</style>

      {/* ✅ Toast container */}
      <ToastContainer />
    </>
  );
};

export default KiduServerTableNavbar;
