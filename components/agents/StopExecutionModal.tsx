"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, StopCircle } from "lucide-react";

interface StopExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmStop: () => void;
  isStopping?: boolean;
}

export function StopExecutionModal({
  isOpen,
  onClose,
  onConfirmStop,
  isStopping = false,
}: StopExecutionModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Stop agent execution?"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#FCA5A5]">
          <AlertTriangle className="h-5 w-5 shrink-0 text-[#EF4444] mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-white">Confirmation Required</p>
            <p className="leading-relaxed">
              Current progress will be preserved, but remaining tasks will not run.
            </p>
          </div>
        </div>

        <p className="text-xs text-[#8B949E] leading-relaxed">
          The agent swarm will immediately halt all in-flight tasks and mark the run as aborted.
        </p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#30363D]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isStopping}
            className="text-xs border-[#30363D] text-[#C9D1D9]"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onConfirmStop}
            disabled={isStopping}
            className="text-xs"
          >
            {isStopping ? (
              <span>Stopping...</span>
            ) : (
              <>
                <StopCircle className="h-3.5 w-3.5 mr-1.5" />
                <span>Stop Execution</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
