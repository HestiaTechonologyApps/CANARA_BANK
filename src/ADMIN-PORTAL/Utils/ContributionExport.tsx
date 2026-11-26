import { useState, type FC } from "react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import type { ContributionDetail } from "../Types/Contributions/MonthlyContributionMasters.types";

type ExportKind = "xlsx" | "pdf";

interface ExportButtonsProps {
  title: string;
  context?: string;
  fileName?: string;
  getRows: () => Promise<ContributionDetail[]>;
  disabled?: boolean;
  includeParkReason?: boolean;
}

interface ExportMeta {
  title: string;
  context: string;
  fileName?: string;
  includeParkReason: boolean;
}

const MONTH_NAMES: string[] = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const AMOUNT_COL = 7;
// Indian digit grouping (12,34,567) for Excel cells
const INR_FORMAT = "[>=10000000]##\\,##\\,##\\,##0;[>=100000]##\\,##\\,##0;##,##0";

const monthName = (month: string | null | undefined): string => {
  if (!month) return "-";
  const num = parseInt(month, 10);
  if (!isNaN(num) && num >= 1 && num <= 12) return MONTH_NAMES[num - 1];
  const abbr = month.trim().toUpperCase().slice(0, 3);
  return MONTH_NAMES.find((m) => m.toUpperCase().startsWith(abbr)) ?? month;
};

const fullYear = (year: string | null | undefined): string => {
  if (!year) return "-";
  const num = parseInt(year, 10);
  return !isNaN(num) && num < 100 ? String(2000 + num) : year;
};

const text = (v: unknown): string => (v === null || v === undefined ? "" : String(v));

const buildHeaders = (includeParkReason: boolean): string[] => {
  const base = ["#", "Name", "Designation", "Staff No", "DP Code", "Circle", "Period", "Amount", "Status"];
  return includeParkReason ? [...base, "Park Reason"] : base;
};

const buildBody = (rows: ContributionDetail[], includeParkReason: boolean): (string | number)[][] =>
  rows.map((r, i) => {
    const line: (string | number)[] = [
      i + 1,
      text(r.name),
      text(r.designation),
      text(r.staffNo),
      text(r.dpCode),
      text(r.circle),
      `${monthName(r.month)} ${fullYear(r.year)}`,
      Number(r.amount) || 0,
      r.isParked ? "Parked" : "Active",
    ];
    if (includeParkReason) line.push(text(r.parkReason ?? ""));
    return line;
  });

const sumAmount = (rows: ContributionDetail[]): number =>
  rows.reduce((s, r) => s + (Number(r.amount) || 0), 0);

const stamp = (): string => new Date().toISOString().split("T")[0];

const fileBase = (meta: ExportMeta): string =>
  meta.fileName ?? `${meta.title.replace(/\s+/g, "_")}_${stamp()}`;

const exportContributionsXlsx = (rows: ContributionDetail[], meta: ExportMeta): void => {
  const headers = buildHeaders(meta.includeParkReason);
  const body = buildBody(rows, meta.includeParkReason);

  const totalRow: (string | number)[] = headers.map(() => "");
  totalRow[AMOUNT_COL - 1] = "Total";
  totalRow[AMOUNT_COL] = sumAmount(rows);

  const aoa: (string | number)[][] = [
    [meta.title],
    [meta.context ? `${meta.context} | Exported on ${stamp()}` : `Exported on ${stamp()}`],
    [],
    headers,
    ...body,
    totalRow,
  ];

  const ws = XLSX.utils.aoa_to_sheet(aoa);

  const firstDataRow = 4;
  const lastRow = firstDataRow + body.length; // includes total row
  for (let r = firstDataRow; r <= lastRow; r++) {
    const cell = ws[XLSX.utils.encode_cell({ r, c: AMOUNT_COL })];
    if (cell) cell.z = INR_FORMAT;
  }

  ws["!cols"] = [
    { wch: 6 }, { wch: 28 }, { wch: 22 }, { wch: 12 }, { wch: 10 },
    { wch: 10 }, { wch: 18 }, { wch: 16 }, { wch: 10 },
    ...(meta.includeParkReason ? [{ wch: 36 }] : []),
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Contributions");
  XLSX.writeFile(wb, `${fileBase(meta)}.xlsx`);
};

const exportContributionsPdf = (rows: ContributionDetail[], meta: ExportMeta): void => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const rs = (n: number): string => `Rs. ${n.toLocaleString("en-IN")}`;

  doc.setFontSize(15);
  doc.text(meta.title, 14, 14);
  doc.setFontSize(9);
  doc.text(meta.context ? `${meta.context} | Exported on ${stamp()}` : `Exported on ${stamp()}`, 14, 20);

  const headers = buildHeaders(meta.includeParkReason);
  const body = buildBody(rows, meta.includeParkReason).map((line) =>
    line.map((cell, i) => (i === AMOUNT_COL ? rs(Number(cell)) : String(cell)))
  );

  const footRow: string[] = headers.map(() => "");
  footRow[AMOUNT_COL - 1] = "Total";
  footRow[AMOUNT_COL] = rs(sumAmount(rows));

  autoTable(doc, {
    startY: 25,
    head: [headers],
    body,
    foot: [footRow],
    showFoot: "lastPage",
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [27, 55, 99] },
    footStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42] },
    columnStyles: { [AMOUNT_COL]: { halign: "right" } },
  });

  doc.save(`${fileBase(meta)}.pdf`);
};

export const ExportButtons: FC<ExportButtonsProps> = ({
  title,
  context = "",
  fileName,
  getRows,
  disabled = false,
  includeParkReason = false,
}) => {
  const [busy, setBusy] = useState<"" | ExportKind>("");

  const run = async (kind: ExportKind): Promise<void> => {
    if (busy) return;
    setBusy(kind);
    try {
      const result = await getRows();
      const rows: ContributionDetail[] = Array.isArray(result) ? result : [];
      if (rows.length === 0) {
        toast.error("No records to export.");
        return;
      }
      const meta: ExportMeta = { title, context, fileName, includeParkReason };
      if (kind === "xlsx") exportContributionsXlsx(rows, meta);
      else exportContributionsPdf(rows, meta);
      toast.success(`Exported ${rows.length.toLocaleString()} records`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setBusy("");
    }
  };

  const items: { kind: ExportKind; label: string }[] = [
    { kind: "xlsx", label: "📊 Excel" },
    { kind: "pdf", label: "📄 PDF" },
  ];

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {items.map(({ kind, label }) => (
        <button
          key={kind}
          type="button"
          onClick={() => run(kind)}
          disabled={disabled || !!busy}
          style={{
            height: 32,
            padding: "0 12px",
            borderRadius: 10,
            border: "1.5px solid #e2e8f0",
            background: "#f8fafc",
            color: "#475569",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "'Sora',sans-serif",
            whiteSpace: "nowrap",
            cursor: disabled || busy ? "not-allowed" : "pointer",
            opacity: disabled || (busy && busy !== kind) ? 0.5 : 1,
          }}
        >
          {busy === kind ? "Exporting…" : label}
        </button>
      ))}
    </div>
  );
};