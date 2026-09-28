"use client";

import React, { useState } from "react";
import { ProjectDetails, BuildPlan } from "@/lib/types";
import { AgentRun } from "@/lib/agents/types";
import { ViewportMode, InspectorRegion } from "@/lib/preview/types";
import { detectPreviewScenario } from "@/lib/preview/scenario-selector";
import { PreviewToolbar } from "./PreviewToolbar";
import { PreviewFrame } from "./PreviewFrame";
import { PreviewInspector } from "./PreviewInspector";
import { SupportDeskPreview } from "./SupportDeskPreview";
import { InternalAssistantPreview } from "./InternalAssistantPreview";
import { DashboardPreview } from "./DashboardPreview";
import { LandingPagePreview } from "./LandingPagePreview";
import { PreviewEmptyState } from "./PreviewEmptyState";
import { PreviewLoadingState } from "./PreviewLoadingState";
import { PreviewErrorState } from "./PreviewErrorState";
import { useToast } from "@/components/ui/Toast";

interface PreviewWorkspaceProps {
  project: ProjectDetails;
  initialPlans?: BuildPlan[];
  initialRuns: AgentRun[];
  selectedPlanId?: string;
}

export function PreviewWorkspace({
  project,
  initialPlans = [],
  initialRuns = [],
  selectedPlanId,
}: PreviewWorkspaceProps) {
  const { addToast } = useToast();

  const [viewportMode, setViewportMode] = useState<ViewportMode>("desktop");
  const [isInspectorActive, setIsInspectorActive] = useState<boolean>(false);
  const [selectedInspectorRegion, setSelectedInspectorRegion] =
    useState<InspectorRegion | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Check if project has completed build execution, or is seeded as deployed
  const hasCompletedRun =
    initialRuns.some((r) => r.status === "completed") ||
    project.status === "deployed" ||
    project.status === "ready" ||
    project.id === "prj_supportdesk";

  // Deterministically select the scenario based on the latest approved/executed build plan
  const scenarioInfo = detectPreviewScenario({
    project,
    initialPlans,
    initialRuns,
    selectedPlanId,
  });

  const handleToggleInspector = () => {
    setIsInspectorActive((prev) => {
      const next = !prev;
      if (!next) {
        setSelectedInspectorRegion(null);
      } else {
        addToast({
          type: "info",
          title: "Visual Inspector Enabled",
          message: "Click any outlined component in the preview to inspect its architecture.",
        });
      }
      return next;
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setPreviewError(null);
    setTimeout(() => {
      setIsRefreshing(false);
      addToast({
        type: "success",
        title: "Preview Refreshed",
        message: "Sandbox state reset cleanly.",
      });
    }, 400);
  };

  const renderScenarioContent = () => {
    switch (scenarioInfo.scenario) {
      case "assistant":
        return (
          <InternalAssistantPreview
            productName={scenarioInfo.productName}
            viewportMode={viewportMode}
            isInspectorActive={isInspectorActive}
            onSelectInspectorRegion={setSelectedInspectorRegion}
          />
        );
      case "dashboard":
        return (
          <DashboardPreview
            productName={scenarioInfo.productName}
            viewportMode={viewportMode}
            isInspectorActive={isInspectorActive}
            onSelectInspectorRegion={setSelectedInspectorRegion}
          />
        );
      case "landing":
        return (
          <LandingPagePreview
            productName={scenarioInfo.productName}
            viewportMode={viewportMode}
            isInspectorActive={isInspectorActive}
            onSelectInspectorRegion={setSelectedInspectorRegion}
          />
        );
      case "supportdesk":
      default:
        return (
          <SupportDeskPreview
            viewportMode={viewportMode}
            isInspectorActive={isInspectorActive}
            onSelectInspectorRegion={setSelectedInspectorRegion}
          />
        );
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#07090E] overflow-hidden select-none">
      {/* Top Preview Workspace Toolbar */}
      <PreviewToolbar
        project={project}
        productName={scenarioInfo.productName}
        currentMode={viewportMode}
        onModeChange={setViewportMode}
        isInspectorActive={isInspectorActive}
        onToggleInspector={handleToggleInspector}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Visual Component Inspector Drawer / Banner */}
      <PreviewInspector
        isInspectorActive={isInspectorActive}
        selectedRegion={selectedInspectorRegion}
        onCloseRegion={() => setSelectedInspectorRegion(null)}
      />

      {/* Main Preview Canvas Area */}
      <div className="flex-1 flex overflow-hidden relative">
        <PreviewFrame
          viewportMode={viewportMode}
          projectDomain={project.liveUrl ? project.liveUrl.replace("https://", "") : `${project.id}.architect.live`}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        >
          {previewError ? (
            <PreviewErrorState
              errorMsg={previewError}
              onRetry={handleRefresh}
            />
          ) : isRefreshing ? (
            <PreviewLoadingState />
          ) : !hasCompletedRun ? (
            <PreviewEmptyState project={project} />
          ) : (
            renderScenarioContent()
          )}
        </PreviewFrame>
      </div>
    </div>
  );
}

