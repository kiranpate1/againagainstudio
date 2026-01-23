"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ProjectContentContextType {
  // Add your context state types here
  // Example:
  // currentProject: string | null;
  // setCurrentProject: (project: string | null) => void;
}

const ProjectContentContext = createContext<ProjectContentContextType | undefined>(undefined);

export function ProjectContentProvider({ children }: { children: ReactNode }) {
  // Add your state management here
  // Example:
  // const [currentProject, setCurrentProject] = useState<string | null>(null);

  return (
    <ProjectContentContext.Provider value={{
      // Add your context values here
    }}>
      {children}
    </ProjectContentContext.Provider>
  );
}

export function useProjectContent() {
  const context = useContext(ProjectContentContext);
  if (context === undefined) {
    throw new Error("useProjectContent must be used within a ProjectContentProvider");
  }
  return context;
}