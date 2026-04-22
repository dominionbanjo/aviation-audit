import { TemplateWithMeta } from "@/lib/services/audit-template.service";

export type Template = TemplateWithMeta;

export interface TemplateStats {
  totalTemplates: number;
  totalQuestions: number;
  averageQuestionsPerTemplate: number;
}
