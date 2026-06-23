"use client";

import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { Calendar } from "iconsax-react";
import { OtpRecord } from "@/redux/api/endpoints/otpEndpoints";

interface ComplianceDetailsModalProps {
  selectedRecord: OtpRecord | null;
  onClose: () => void;
}

export function ComplianceDetailsModal({
  selectedRecord,
  onClose,
}: ComplianceDetailsModalProps) {
  return (
    <Modal
      isOpen={selectedRecord !== null}
      onClose={onClose}
      title={selectedRecord ? `OTP Audit: ${selectedRecord.flightNumber} Details` : ""}
      className="sm:max-w-[700px] overflow-hidden"
    >
      {selectedRecord && (
        <div className="space-y-6 pt-2">
          
          {/* Header badges */}
          <div className="flex flex-wrap gap-2 items-center justify-between border-b border-border/50 pb-4">
            <div>
              <span className="text-[10px] font-mono text-muted-foreground block">Flight Date</span>
              <span className="text-sm font-semibold text-foreground flex items-center gap-1">
                <Calendar size={16} variant="Outline" color="currentColor" className="text-muted-foreground" />
                {new Date(selectedRecord.date).toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex gap-2">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                selectedRecord.wasDelayed 
                  ? "bg-red-500/10 text-red-500 border-red-500/20" 
                  : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              }`}>
                {selectedRecord.wasDelayed ? "Delayed" : "On-Time"}
              </span>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                selectedRecord.wasSopFollowed 
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                  : "bg-red-500/10 text-red-500 border-red-500/20"
              }`}>
                {selectedRecord.wasSopFollowed ? "SOP Followed" : "SOP Violation"}
              </span>
            </div>
          </div>

          {/* Flight info grid */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary border-l-2 border-primary pl-2">
              Flight Operations
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border rounded-xl bg-muted/20">
              <div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Airline</span>
                <span className="text-xs font-bold text-foreground block">{selectedRecord.airline}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Sector Route</span>
                <span className="text-xs font-mono font-bold text-foreground block">{selectedRecord.route}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Aircraft Type</span>
                <span className="text-xs font-bold text-foreground block">{selectedRecord.aircraftType}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Registration</span>
                <span className="text-xs font-bold text-foreground block">{selectedRecord.aircraftRegistration}</span>
              </div>
            </div>
          </div>

          {/* Schedule times grid */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary border-l-2 border-primary pl-2">
              Scheduled vs Actual Dispatch
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 p-4 border rounded-xl bg-muted/20">
              <div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase block">STD (Sched Dep)</span>
                <span className="text-xs font-mono font-bold">
                  {new Date(selectedRecord.scheduledDeparture).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "UTC"
                  })}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase block">ATD (Actual Dep)</span>
                <span className="text-xs font-mono font-bold">
                  {new Date(selectedRecord.actualDeparture).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "UTC"
                  })}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase block">STA (Sched Arr)</span>
                <span className="text-xs font-mono font-bold">
                  {new Date(selectedRecord.scheduledArrival).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "UTC"
                  })}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase block">ATA (Actual Arr)</span>
                <span className="text-xs font-mono font-bold">
                  {new Date(selectedRecord.actualArrival).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "UTC"
                  })}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase block">Delay Min</span>
                <span className={`text-xs font-mono font-bold block ${selectedRecord.delayMinutes > 15 ? "text-red-500" : "text-emerald-500"}`}>
                  {selectedRecord.delayMinutes} Minutes
                </span>
              </div>
            </div>
          </div>

          {/* Delay Info if delayed */}
          {selectedRecord.wasDelayed && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-red-500 border-l-2 border-red-500 pl-2">
                Delay & Classification Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border border-red-500/10 rounded-xl bg-red-500/5">
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase block">IATA Delay Code</span>
                  <span className="text-xs font-mono font-bold text-red-500">
                    Code {selectedRecord.delayCode || "N/A"}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase block">Reason Details</span>
                  <p className="text-xs text-foreground mt-0.5">
                    {selectedRecord.delayDescription || "No detailed delay explanation logged."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Phase delays */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary border-l-2 border-primary pl-2">
              Phase-Specific Delays (Minutes)
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 p-4 border rounded-xl bg-muted/20 text-center">
              <div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase block">Boarding</span>
                <span className="text-xs font-mono font-bold">{selectedRecord.boardingDelay || 0}m</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase block">Refueling</span>
                <span className="text-xs font-mono font-bold">{selectedRecord.refuelingDelay || 0}m</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase block">Pushback</span>
                <span className="text-xs font-mono font-bold">{selectedRecord.pushbackDelay || 0}m</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase block">Crew Chk</span>
                <span className="text-xs font-mono font-bold">{selectedRecord.crewReportingDelay || 0}m</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase block">Maint</span>
                <span className="text-xs font-mono font-bold">{selectedRecord.maintenanceDelay || 0}m</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase block">Baggage</span>
                <span className="text-xs font-mono font-bold">{selectedRecord.baggageHandlingDelay || 0}m</span>
              </div>
            </div>
          </div>

          {/* Responsibility & flags */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary border-l-2 border-primary pl-2">
              Responsibility & Corrective Plans
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border rounded-xl bg-muted/20 space-y-3">
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase block">Primary Department</span>
                  <span className="text-xs font-bold text-foreground">{selectedRecord.responsibleDepartment}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-foreground">
                    <input
                      type="checkbox"
                      checked={selectedRecord.crewIssue}
                      readOnly
                      disabled
                      className="h-3.5 w-3.5 rounded border-border"
                    />
                    Crew Issue
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-foreground">
                    <input
                      type="checkbox"
                      checked={selectedRecord.maintenanceIssue}
                      readOnly
                      disabled
                      className="h-3.5 w-3.5 rounded border-border"
                    />
                    Maint Issue
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-foreground">
                    <input
                      type="checkbox"
                      checked={selectedRecord.groundHandlingIssue}
                      readOnly
                      disabled
                      className="h-3.5 w-3.5 rounded border-border"
                    />
                    Ground Issue
                  </label>
                </div>
              </div>

              <div className="p-4 border rounded-xl bg-muted/20 space-y-3">
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-1.5 text-xs text-foreground">
                    <input
                      type="checkbox"
                      checked={selectedRecord.wasEscalationDone}
                      readOnly
                      disabled
                      className="h-3.5 w-3.5 rounded border-border"
                    />
                    Escalation Completed
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-foreground">
                    <input
                      type="checkbox"
                      checked={selectedRecord.wasDelayAvoidable}
                      readOnly
                      disabled
                      className="h-3.5 w-3.5 rounded border-border"
                    />
                    Delay was Avoidable
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Immediate CAR plan & Auditor Remarks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border/50 pt-4">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Corrective Action Request (CAR)</span>
              <p className="text-xs text-foreground bg-muted/20 border p-3 rounded-lg mt-1 min-h-[60px]">
                {selectedRecord.correctiveAction || "No immediate CAR required."}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Auditor Remarks</span>
              <p className="text-xs text-foreground bg-muted/20 border p-3 rounded-lg mt-1 min-h-[60px]">
                {selectedRecord.auditorRemarks || "No compliance remarks logged."}
              </p>
            </div>
          </div>

          {/* Modal action */}
          <div className="flex justify-end pt-4 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 px-6 font-bold text-xs"
            >
              Close Audit View
            </Button>
          </div>

        </div>
      )}
    </Modal>
  );
}
