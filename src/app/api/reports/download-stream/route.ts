import { getAudits } from "@/lib/services/audit.service";
import { getFindings } from "@/lib/services/findings.service";
import { getOtpRecordsList } from "@/lib/services/otp.service";
import { withAuth } from "@/lib/api/withAuth";
import { NextResponse } from "next/server";

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "audits";
  
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendLine = (line: string) => {
        controller.enqueue(encoder.encode(line + "\r\n"));
      };

      // Prepends UTF-8 BOM so Microsoft Excel automatically decodes accents/commas correctly
      controller.enqueue(encoder.encode("\ufeff"));

      try {
        if (type === "audits") {
          const audits = await getAudits();
          sendLine("Audit Ref,Location/Facility,Template,Date,Status,Auditor");
          for (const a of audits) {
            const dateStr = new Date(a.date).toLocaleDateString("en-GB");
            const statusStr = a.status; // e.g. Completed or In-Progress
            const auditorStr = a.auditorName || "N/A";
            sendLine(`"${a.refNo}","${a.location}","${a.templateName || "General Safety"}","${dateStr}","${statusStr}","${auditorStr}"`);
          }
        } else if (type === "otp") {
          const otpLogs = await getOtpRecordsList();
          sendLine("Date,Flight Number,Airline,Sector Route,STD,ATD,Delay Minutes,SOP Compliant,Preventable");
          for (const o of otpLogs) {
            const dateStr = new Date(o.date).toLocaleDateString("en-GB");
            const stdStr = new Date(o.scheduledDeparture).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
            const atdStr = new Date(o.actualDeparture).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
            sendLine(`"${dateStr}","${o.flightNumber}","${o.airline}","${o.route}","${stdStr}","${atdStr}","${o.delayMinutes}","${o.wasSopFollowed ? "Yes" : "No"}","${o.wasDelayAvoidable ? "Yes" : "No"}"`);
          }
        } else if (type === "findings") {
          const findings = await getFindings();
          sendLine("Audit Ref,Location,Category,Severity,Finding Status,Root Cause,Corrective Action,Deadline");
          for (const f of findings) {
            const deadlineStr = f.deadline ? new Date(f.deadline).toLocaleDateString("en-GB") : "Unscheduled";
            sendLine(`"${f.auditRefNo}","${f.auditLocation}","${f.categoryName}","${f.questionSeverity}","${f.findingStatus.toUpperCase()}","${f.rootCause || "Unassigned"}","${f.correctiveAction || "Pending CAR"}","${deadlineStr}"`);
          }
        }
      } catch (err) {
        console.error("CSV Stream export error:", err);
      } finally {
        controller.close();
      }
    }
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${type}_report_stream.csv"`,
      "Transfer-Encoding": "chunked",
    }
  });
});
