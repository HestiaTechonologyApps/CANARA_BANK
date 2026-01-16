import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface MainPage {
  dpCode: string;
  mainPageId: number;         
  corouselImage1: string;     
  corouselImage2: string;      
  corouselImage3: string;      
  mainText: string;            
  slogan: string;              
  logoImage1: string;          
  logoImage2: string;          
  contactDesc1: string;        
  contactDesc2: string;        
  contactLine1: string;        
  contactLine2: string;       
  contactLine3: string;        
  phonenum: string;            
  faxnum: string;              
  website: string;             
  email: string;               
  rulesRegulation: string;     
  dayQuote: string;           
  companyId: number;   
  companyName:string;     
  auditLogs?: AuditTrails[];   
}
