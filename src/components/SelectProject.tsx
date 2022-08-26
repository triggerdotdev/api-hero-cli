import { Select } from "@boost/cli/react";
import { Box, Text } from "ink";
import React, { useEffect } from "react";
import { AuthToken, ProjectConfig } from "../api/types";
import { useSelectProject } from "../hooks/useSelectProject";
import { TaskDisplay } from "./TaskDisplay";

type SelectProjectProps = {
  authToken: AuthToken;
  onComplete: (projectConfig: ProjectConfig) => void;
}

export function SelectProject({ authToken, onComplete }: SelectProjectProps) {
  const { currentState, allStates, selectedProject, selectedWorkspace, createWorkspace, createProject } = useSelectProject(authToken);

  useEffect(() => {
    if (currentState.type === "complete") {
      onComplete(currentState);
    }
  }, [currentState]);

  return <Box flexDirection="column">
    {allStates.map((status, index) => {
      switch (status.type) {
        case "checking":
          return <Text key={status.type}>Checking for linked project</Text>
        case "fetchingProjects":
          return (
            <Box key={status.type} flexDirection="column">
              <Text>No linked project</Text>
              <TaskDisplay isComplete={index < allStates.length - 1}>Fetching your projects…</TaskDisplay>
            </Box>)
        case "selectProject":
          if (status.projects.length === 0) {
            return <Text key={status.type}>No projects found, let’s create one</Text>
          } else {
            return (
              <Box key={status.type} flexDirection="column">
                <Text>Found {status.projects.length} projects</Text>
                <Select
                  label="Which API would you like to install"
                  onSubmit={(value) => {
                    const project = status.projects.find(r => r.id === value);
                    selectedProject(project);
                  }}
                  options={[
                    ...status.projects.map(r => (
                      {
                        label:
                          <Text>{r.workspace.name}/<Text>{r.name}</Text></Text>,
                        value: r.id
                      }
                    )),
                    { label: "Create a new project", value: "" }]}
                />
              </Box>)
          }
        default:
          return <Text key={status.type}></Text>
      }
    })}
  </Box>;
}