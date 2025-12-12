import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface MainPage {
  mainPageId: number;          // e.g., 0
  corouselImage1: string;      // e.g., "Img"
  corouselImage2: string;      // e.g., "img"
  corouselImage3: string;      // e.g., "img"
  mainText: string;            // e.g., "hello"
  slogan: string;              // e.g., "hi"
  logoImage1: string;          // e.g., "hello"
  logoImage2: string;          // e.g., "hello"
  contactDesc1: string;        // e.g., "hi"
  contactDesc2: string;        // e.g., "hi"
  contactLine1: string;        // e.g., "hi"
  contactLine2: string;        // e.g., "hi"
  contactLine3: string;        // e.g., "hi"
  phonenum: string;            // e.g., "9876543210"
  faxnum: string;              // e.g., "009"
  website: string;             // e.g., "www.hello.com"
  email: string;               // e.g., "hi@gmail.com"
  rulesRegulation: string;     // e.g., "no rules"
  dayQuote: string;            // e.g., "hi"
  companyId: number;   
  companyName:string;     
  auditLogs?: AuditTrails[];   // optional audit trail entries
}
