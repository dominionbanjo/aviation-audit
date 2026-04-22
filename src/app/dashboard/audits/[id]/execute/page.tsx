import { AuditExecution } from "@/components/audit/AuditExecution";

export default async function AuditExecutionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AuditExecution auditId={id} />;
}
