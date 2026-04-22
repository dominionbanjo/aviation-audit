export type AuditStatus = "Completed" | "In-Progress" | "Draft";

export interface AuditRecord {
  id: string;
  refNo: string;
  date: string | Date;
  location: string;
  templateId: string;
  templateName: string;
  auditorId: string;
  auditorName: string | null;
  status: AuditStatus;
  responseCount?: number;
}
