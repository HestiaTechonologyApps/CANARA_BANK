import React from "react";
import { Row, Col, Button, Dropdown, ButtonGroup } from "react-bootstrap";
import { BsPrinter, BsFiletypeCsv, BsFiletypePdf } from "react-icons/bs";
import { FaCopy, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface KiduServerTableNavbarProps {
  // Data props
  data?: any[];
  columns?: Array<{ key: string; label: string; type?: string }>;
  title?: string;
  
  // Search props
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  
  // Add button props
  showAddButton?: boolean;
  addButtonLabel?: string;
  addRoute?: string;
  onAddClick?: () => void;
  
  // Export props
  showExportButtons?: boolean;
  
  // Rows per page selector
  showRowsPerPageSelector?: boolean;
  rowsPerPage?: number;
  onRowsPerPageChange?: (rows: number) => void;
  rowsPerPageOptions?: number[];
  
  // Additional action buttons
  additionalButtons?: React.ReactNode;
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
}) => {
  
  // Helper function to clean cell values for export
  const cleanCellValue = (value: any, columnType?: string): string => {
    // Handle null/undefined
    if (value === null || value === undefined || value === '') {
      return '';
    }
    
    // Handle booleans
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    // Handle checkbox type
    if (columnType === 'checkbox') {
      const boolValue = typeof value === 'boolean' ? value : 
                       typeof value === 'string' ? (value.toLowerCase() === 'true' || value === '1') :
                       typeof value === 'number' ? value !== 0 : false;
      return boolValue ? 'Yes' : 'No';
    }
    
    // Handle image type - return empty for exports
    if (columnType === 'image') {
      return '';
    }
    
    // Handle dates
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    
    // Convert to string and clean
    return String(value).trim();
  };

  // Copy to clipboard
  const handleCopy = () => {
    if (data.length === 0) return;

    const headers = columns
      .filter(col => col.type !== 'image') // Skip image columns
      .map(col => col.label)
      .join("\t");
    
    const rows = data.map(row => 
      columns
        .filter(col => col.type !== 'image')
        .map(col => cleanCellValue(row[col.key], col.type))
        .join("\t")
    ).join("\n");
    
    const textToCopy = `${headers}\n${rows}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert("Data copied to clipboard!");
    }).catch(err => {
      console.error("Failed to copy:", err);
      alert("Failed to copy data to clipboard");
    });
  };

  // Export to CSV
  const handleCSV = () => {
    if (data.length === 0) return;

    const headers = columns
      .filter(col => col.type !== 'image')
      .map(col => col.label)
      .join(",");
    
    const rows = data.map(row => 
      columns
        .filter(col => col.type !== 'image')
        .map(col => {
          let value = cleanCellValue(row[col.key], col.type);
          
          // Escape values containing commas, quotes, or newlines
          if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          
          return value;
        })
        .join(",")
    ).join("\n");
    
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Export to Excel
  const handleExcel = () => {
    if (data.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(
      data.map(row => {
        const obj: any = {};
        columns
          .filter(col => col.type !== 'image')
          .forEach(col => {
            obj[col.label] = cleanCellValue(row[col.key], col.type);
          });
        return obj;
      })
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${title}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Export to PDF with proper formatting
  const handlePDF = () => {
    if (data.length === 0) return;

    // Use landscape orientation for better column width
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add title
    doc.setFontSize(16);
    doc.setTextColor(27, 55, 99); // #1B3763
    doc.text(title, 14, 15);
    
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
    
    // Filter out image and checkbox columns for cleaner PDF
    const exportColumns = columns.filter(col => 
      col.type !== 'image' && col.type !== 'checkbox'
    );
    
    // Prepare table data
    const tableHeaders = exportColumns.map(col => col.label);
    const tableData = data.map(row => 
      exportColumns.map(col => {
        const value = cleanCellValue(row[col.key], col.type);
        return value || '-';
      })
    );

    // Add table with better styling and auto column widths
    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: 28,
      
      // Styling
      styles: { 
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak',
        cellWidth: 'auto'
      },
      
      headStyles: { 
        fillColor: [27, 55, 99], // #1B3763
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      
      bodyStyles: {
        textColor: [50, 50, 50]
      },
      
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      
      // Auto column widths based on content
      columnStyles: {},
      
      // Better margins
      margin: { top: 28, right: 10, bottom: 10, left: 10 },
      
      // Handle page breaks properly
      showHead: 'everyPage',
      
      // Add page numbers
      didDrawPage: function() {
        // Footer with page number
        const pageCount = (doc as any).internal.getNumberOfPages();
        const pageNumber = (doc as any).internal.getCurrentPageInfo().pageNumber;
        
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Page ${pageNumber} of ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
    });

    doc.save(`${title}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // ✅ FIXED: Print with proper cancel/close handling
  const handlePrint = () => {
    if (data.length === 0) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print");
      return;
    }

    // Filter out image columns for printing
    const printColumns = columns.filter(col => col.type !== 'image');

    const headers = printColumns.map(col => `<th>${col.label}</th>`).join("");
    const rows = data.map(row => {
      const cells = printColumns.map(col => {
        const value = cleanCellValue(row[col.key], col.type);
        
        // Escape HTML
        const escapedValue = value
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
        
        return `<td>${escapedValue || '-'}</td>`;
      }).join("");
      
      return `<tr>${cells}</tr>`;
    }).join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px;
            }
            h1 { 
              color: #1B3763; 
              margin-bottom: 10px;
              font-size: 24px;
            }
            .meta {
              color: #666;
              font-size: 12px;
              margin-bottom: 20px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px;
              font-size: 11px;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 8px; 
              text-align: left;
            }
            th { 
              background-color: #1B3763; 
              color: white; 
              font-weight: bold;
              font-size: 12px;
            }
            tr:nth-child(even) { 
              background-color: #f2f2f2; 
            }
            @media print {
              body { margin: 10px; }
              h1 { font-size: 20px; }
              table { font-size: 10px; }
              th, td { padding: 6px; }
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div class="meta">Generated on: ${new Date().toLocaleString()}</div>
          <table>
            <thead><tr>${headers}</tr></thead>
            <tbody>${rows}</tbody>
          </table>
          <script>
            // Auto-trigger print dialog
            window.onload = function() {
              window.print();
            }
            
            // ✅ Close window after print dialog is closed (whether user prints or cancels)
            window.onafterprint = function() {
              window.close();
            };
            
            // ✅ Handle if user manually closes the window
            window.addEventListener('beforeunload', function(e) {
              // Allow closing without confirmation
              return undefined;
            });
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <>
      {/* Navbar Row - Export Buttons, Rows Selector, and Additional Buttons */}
      {(showExportButtons || showRowsPerPageSelector || additionalButtons) && (
        <Row className="mb-3 align-items-center">
          {/* Left side - Rows selector and Export buttons */}
          <Col xs="auto">
            <div className="d-flex gap-2 flex-wrap align-items-center">
              {/* Show rows dropdown */}
              {showRowsPerPageSelector && (
                <Dropdown as={ButtonGroup}>
                  <Dropdown.Toggle
                    variant="secondary"
                    size="sm"
                    style={{
                      backgroundColor: "#6c757d",
                      border: "none",
                      fontFamily: "Urbanist",
                      fontSize: "13px",
                      height: "31px",
                    }}
                  >
                    Show {rowsPerPage} rows
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {rowsPerPageOptions.map((option) => (
                      <Dropdown.Item
                        key={option}
                        active={rowsPerPage === option}
                        onClick={() => onRowsPerPageChange?.(option)}
                      >
                        {option} rows
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              )}

              {/* Export Buttons */}
              {showExportButtons && (
                <>
                  {/* Copy Button */}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCopy}
                    disabled={data.length === 0}
                    style={{
                      backgroundColor: "#6c757d",
                      border: "none",
                      fontFamily: "Urbanist",
                      fontSize: "13px",
                      height: "31px",
                    }}
                  >
                    <FaCopy className="me-1" /> Copy
                  </Button>

                  {/* CSV Button */}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCSV}
                    disabled={data.length === 0}
                    style={{
                      backgroundColor: "#6c757d",
                      border: "none",
                      fontFamily: "Urbanist",
                      fontSize: "13px",
                      height: "31px",
                    }}
                  >
                    <BsFiletypeCsv className="me-1" /> CSV
                  </Button>

                  {/* Excel Button */}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleExcel}
                    disabled={data.length === 0}
                    style={{
                      backgroundColor: "#6c757d",
                      border: "none",
                      fontFamily: "Urbanist",
                      fontSize: "13px",
                      height: "31px",
                    }}
                  >
                    <FaFileExcel className="me-1" /> Excel
                  </Button>

                  {/* PDF Button */}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handlePDF}
                    disabled={data.length === 0}
                    style={{
                      backgroundColor: "#6c757d",
                      border: "none",
                      fontFamily: "Urbanist",
                      fontSize: "13px",
                      height: "31px",
                    }}
                  >
                    <BsFiletypePdf className="me-1" /> PDF
                  </Button>

                  {/* Print Button */}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handlePrint}
                    disabled={data.length === 0}
                    style={{
                      backgroundColor: "#6c757d",
                      border: "none",
                      fontFamily: "Urbanist",
                      fontSize: "13px",
                      height: "31px",
                    }}
                  >
                    <BsPrinter className="me-1" /> Print
                  </Button>
                </>
              )}
            </div>
          </Col>

          {/* Right side - Additional Custom Buttons */}
          {additionalButtons && (
            <Col xs="auto" className="ms-auto d-flex gap-2 align-items-center">
              {additionalButtons}
            </Col>
          )}
        </Row>
      )}
    </>
  );
};

export default KiduServerTableNavbar;